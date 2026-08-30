'use strict';
const bcrypt = require('bcryptjs');
const express = require('express');
const crypto = require('crypto');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const config = require('../../config/config.json');
const User = require('../models/User.js');
const PasswordReset = require('../models/PasswordReset.js');
const logger = require('../../util/logger');
const { registerUser, testPasswordStrength } = require('../util/userHelpers');
const { verifyCaptcha } = require('../util/captcha');
const { decodeToken } = require('../util/token-functions');
const jwt = require('jsonwebtoken');
const {
  OK,
  BAD_REQUEST,
  FORBIDDEN,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const PASSWORD_RESET_EXPIRATION = require('../../util/constants').PASSWORD_RESET_EXPIRATION;
const { sendVerificationEmail, sendPasswordReset } = require('../util/emailHelpers');
const {
  userWithEmailExists,
  checkIfPageCountResets,
  findPasswordReset,
  expireMembershipIfLapsed
} = require('../util/userHelpers');

const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');

// Register a member
router.post('/register', async (req, res) => {
  const registrationStatus = await registerUser(req.body);
  if (registrationStatus.userSaved) {
    const name = req.body.firstName + ' ' + req.body.lastName;
    const user = await User.findOne({email: req.body.email});

    if (user) {
      AuditLog.create({
        userId: user._id,
        action: AuditLogActions.SIGN_UP,
        details: {email: req.body.email}
      }).catch(logger.error);
    }

    sendVerificationEmail(name, req.body.email);
    return res.sendStatus(OK);
  }
  if (registrationStatus.status === 'BAD_REQUEST') {
    return res.status(BAD_REQUEST).send({
      message: registrationStatus.message
    });
  }
  return res.status(CONFLICT).send({ message: registrationStatus.message });
});

router.post('/resendVerificationEmail', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  const maybeUser = await userWithEmailExists(req.body.email);
  if (!maybeUser) {
    return res.sendStatus(NOT_FOUND);
  }
  let name = maybeUser.firstName + ' ' + maybeUser.lastName;
  sendVerificationEmail(name, req.body.email);
  res.sendStatus(OK);
});

router.post('/sendPasswordReset', async (req, res) => {
  const emailRegex = /[a-zA-Z0-9\.-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}/;
  const invalidEmail = !req.body.email || !emailRegex.test(req.body.email);

  if (invalidEmail) {
    return res.status(BAD_REQUEST).send({
      message: 'Invalid email.'
    });
  }

  if (process.env.NODE_ENV === 'production') {
    const captchaValid = await verifyCaptcha(req.body.captchaToken);
    if (!captchaValid.success) {
      return res.status(BAD_REQUEST).send({
        message: 'Captcha verification failed.'
      });
    }
  }

  await User.findOne({ email: req.body.email }, async function(error, result) {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    if (!result) {
      return res.sendStatus(OK);
    }
    if (
      [
        membershipState.PENDING,
        membershipState.BANNED,
      ].includes(result.accessLevel)
    ) {
      return res.status(UNAUTHORIZED).send({
        message: 'Cannot reset password, account is in a bad state!'
      });
    }

    const buffer = crypto.randomBytes(12);
    let id = buffer.toString('base64');

    const resetToken = id.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    try {
      const passwordReset = new PasswordReset({
        resetToken,
        userId: String(result._id),
        // 24 hours in milliseconds, (86,400,000 ms)
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await sendPasswordReset(resetToken, req.body.email);
      await passwordReset.save();

      // create audit log for sending reset password email
      AuditLog.create({
        userId: result._id,
        action: AuditLogActions.SEND_RESET_PW_EMAIL,
        details: {
          email: result.email,
        }
      }).catch(logger.error);
    } catch (error) {
      logger.error('unable to save password reset token:', error);
    }

    res.sendStatus(OK);
  });
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.sendStatus(BAD_REQUEST);

    const user = await User.findOne({ email: email.toLowerCase() });

    const isMatch = await new Promise((resolve, reject) => {
      if (!user) {
        resolve(false);
      }
      user.comparePassword(req.body.password, (err, match) => {
        if (err) reject(err);
        resolve(match);
      });
    });

    if (!isMatch) {
      return res.status(UNAUTHORIZED).send({
        message: 'Username or password does not match our records.'
      });
    }

    if (!user.emailVerified) {
      return res
        .status(UNAUTHORIZED)
        .send({ message: `The email ${req.body.email} has not been verified` });
    }

    if (user.accessLevel === membershipState.BANNED) {
      return res.status(UNAUTHORIZED).send({ message: `Account ${email} is banned lol` });
    }

    // Nothing else expires memberships, so catch a lapsed one here and strip
    // the door code before it can be handed back out on the profile page
    const membershipLapsed = expireMembershipIfLapsed(user);

    // Handle Page Reset
    if (checkIfPageCountResets(user.lastLogin)) {
      user.pagesPrinted = 0;
    }
    user.lastLogin = new Date();
    await user.save();

    if (membershipLapsed) {
      logger.info('Membership lapsed, revoked door code for user:', String(user._id));
    }

    const token = jwt.sign({
      _id: user._id,
      accessLevel: user.accessLevel,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessLevel: user.accessLevel,
      pagesPrinted: user.pagesPrinted,
      _id: user._id
    }, config.secretKey, { expiresIn: '2h' });

    // Create audit log on successful sign-in
    AuditLog.create({
      userId: user._id,
      action: AuditLogActions.LOG_IN,
      details: { email: user.email }
    }).catch(logger.error);

    res.cookie('jwtToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 2 * 60 * 60 * 1000
    });

    res.json({ token: `JWT ${token}` });

  } catch (error) {
    logger.error('unable to login user', error);
    res.sendStatus(SERVER_ERROR);
  }
});

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
// Returns the name and accesslevel of the user w/ the given access token
router.post('/verify', async function(req, res) {
  const decoded = await decodeToken(req);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }
  // Return the cookie's token in the body so the React app can keep
  // attaching Authorization: Bearer headers for API calls. External
  // callers using a header to authenticate get back their own token.
  const cookieToken = req.cookies && req.cookies.jwtToken;
  const headerToken = req.headers.authorization
    && req.headers.authorization.startsWith('Bearer ')
    ? req.headers.authorization.split('Bearer ')[1]
    : null;
  const rawToken = cookieToken || headerToken;
  res.status(OK).json({ ...decoded.token, token: rawToken ? `JWT ${rawToken.replace(/^JWT\s/, '')}` : undefined });
});

router.post('/logout', function(req, res) {
  res.clearCookie('jwtToken', { path: '/' });
  res.sendStatus(OK);
});

router.post('/generateHashedId', async (req, res) => {
  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    if (!result) {
      return res.sendStatus(NOT_FOUND);
    }
    let hashedId = String(result._id);
    // Generate a salt and created a hashed value of the _id using
    // bcrypts library
    bcrypt.genSalt(10, function(error, salt) {
      if (error) {
        // reject('Bcrypt failed')
        res.sendStatus(BAD_REQUEST);
      }

      bcrypt.hash(hashedId, salt, function(error, hash) {
        if (error) {
          res.sendStatus(BAD_REQUEST);
        }
        hashedId = hash;
        res.status(OK).send({ hashedId });
      });
    });
  });
});

router.post('/validateVerificationEmail', async (req, res) => {
  User.findOne({ email: req.body.email }, async function(error, result) {
    if (error) {
      res.sendStatus(BAD_REQUEST);
    }
    if (!result) {
      res.sendStatus(NOT_FOUND);
    }

    bcrypt.compare(String(result._id), req.body.hashedId, async function(
      error,
      isMatch) {
      if (error) {
        res.sendStatus(BAD_REQUEST);
      }
      if (isMatch) {
        result.emailVerified = true;
        result.accessLevel = membershipState.NON_MEMBER;
        await result
          .save()
          .then(_ => {
            res.sendStatus(OK);
          })
          .catch(err => {
            res.sendStatus(BAD_REQUEST);
          });
      } else {
        res.sendStatus(BAD_REQUEST);
      }
    });
  });
});

router.post('/validatePasswordReset', async (req, res) => {
  try {
    const passwordReset = await findPasswordReset(req.body.resetToken);
    if (!passwordReset) {
      return res.status(NOT_FOUND).send({ message: 'Invalid or expired reset token.' });
    }
    res.sendStatus(OK);
  } catch (error) {
    logger.error('Unable to validate password reset:', error);
    return res.sendStatus(BAD_REQUEST);
  }
});

router.post('/resetPassword', async (req, res) => {
  const testPassword = testPasswordStrength(req.body.password);
  if (!testPassword.success) {
    return res.status(BAD_REQUEST).send({
      message: 'Password does not meet requirements.'
    });
  }

  try {
    const userId = await findPasswordReset(req.body.resetToken);
    if (!userId) {
      return res.status(NOT_FOUND).send({ message: 'Invalid or expired reset token.' });
    }
    if (!req.body.hashedId) {
      logger.error('Missing hashedId in resetPassword request');
      return res.status(BAD_REQUEST).send({ message: 'Missing hashedId.' });
    }
    const validId = await bcrypt.compare(String(userId), req.body.hashedId);
    if (!validId) {
      return res.status(BAD_REQUEST).send({ message: 'Invalid user ID.' });
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'User not found.' });
    }
    user.password = req.body.password;
    await user.save();

    // create audit log for user succesfully resetting password
    AuditLog.create({
      userId: user._id,
      action: AuditLogActions.RESET_PW
    }).catch(logger.error);
    await PasswordReset.deleteOne({ resetToken: req.body.resetToken });
  } catch (error) {
    logger.error('Unable to reset password:', error);
    // Only return 404 if the error is about the reset token, otherwise 400
    if (error && error.message && error.message.includes('reset token')) {
      return res.status(NOT_FOUND).send({ message: 'Invalid or expired reset token.' });
    }
    return res.sendStatus(BAD_REQUEST);
  }

  res.sendStatus(OK);
});

module.exports = router;
