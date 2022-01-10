'use strict';
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const config = require('../../config/config');
const User = require('../models/User.js');
const PasswordReset = require('../models/password-reset');
const { registerUser } = require('../util/registerUser');
const {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken
} = require('../../util/token-functions');
const jwt = require('jsonwebtoken');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT,
  UNPROCESSABLE_ENTITY,
  INTERNAL_SERVER_ERROR
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const addErrorLog = require('../util/logging-helpers');

function checkIfPageCountResets(lastLogin) {
  if (!lastLogin) return false;

  const newDate = new Date();
  // + 1 to account for daylight savings time
  newDate.setDate(newDate.getDate() + 1);
  const amountOfDaysToLastSunday = newDate.getDate() - newDate.getDay();
  const lastSundayDate = new Date();
  lastSundayDate.setDate(amountOfDaysToLastSunday); // last sunday
  lastSundayDate.setHours(23, 59, 59); // 11:59:59 PM

  // If the last login is before last Sunday
  // at 1 second before midnight, return true
  if (lastLogin < lastSundayDate) return true;

  return false;
}

// Register a member
router.post('/register', async (req, res) => {
  const registrationStatus = await registerUser(req.body);
  if (!registrationStatus.userSaved) {
    if (registrationStatus.status === 'BAD_REQUEST') {
      return res.status(BAD_REQUEST).send({
        message: registrationStatus.message
      });
    } else {
      res.status(CONFLICT).send({ message: registrationStatus.message });
    }
  } else {
    res.sendStatus(OK);
  }
});

// User Login
router.post('/login', function(req, res) {
  if (!req.body.email || !req.body.password) {
    return res.sendStatus(BAD_REQUEST);
  }

  User.findOne(
    {
      email: req.body.email.toLowerCase()
    },
    function(error, user) {
      if (error) {
        return res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      }

      if (!user) {
        res
          .status(UNAUTHORIZED)
          .send({
            message: 'Username or password does not match our records.'
          });
      } else {
        // Check if password matches database
        user.comparePassword(req.body.password, function(error, isMatch) {
          if (isMatch && !error) {
            if (user.accessLevel === membershipState.BANNED) {
              return res
                .status(UNAUTHORIZED)
                .send({ message: 'User is banned.' });
            }

            // Check if the user's email has been verified
            if(!user.emailVerified){
              return res
                .status(UNAUTHORIZED)
                .send({message: 'Email has not been verified'});
            }

            // If the username and password matches the database, assign and
            // return a jwt token
            const jwtOptions = {
              expiresIn: '2h'
            };

            // check here to see if we should reset the pagecount. If so, do it
            if (checkIfPageCountResets(user.lastLogin)) {
              User.updateOne(
                // query
                { email: user.email },
                // update this field
                { pagesPrinted: 0 }
              );
            }

            // Include fields from the User model that should
            // be passed to the JSON Web Token (JWT)
            const userToBeSigned = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              accessLevel: user.accessLevel,
              pagesPrinted: user.pagesPrinted
            };
            const token = jwt.sign(
              userToBeSigned, config.secretKey, jwtOptions
            );
            res.status(OK).send({ token: 'JWT ' + token });
          } else {
            res.status(UNAUTHORIZED).send({
              message: 'Username or password does not match our records.'
            });
          }
        });
      }
    }
  );
});

// Edit/Update a member record
router.post('/setEmailToVerified', (req, res) => {
  const query = { email: req.body.email };

  User.updateOne(query, { emailVerified: true }, function(error, result) {
    if (error) {
      const info = {
        userEmail: req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'user/setEmailToVerified',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.queryEmail} not found.` });
    }

    return res.status(OK).send({
      message: `${req.body.queryEmail} was updated.`
    });
  });
});

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
// Returns the name and accesslevel of the user w/ the given access token
router.post('/verify', function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const isValid = checkIfTokenValid(req, membershipState.ALUMNI);
  if (!isValid) {
    res.sendStatus(UNAUTHORIZED);
  } else {
    res.status(OK).send(decodeToken(req));
  }
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


// If the email exists in db, generate a token and store in 
// password_reset collection.
// Every reset request of the same account updates the token in the DB.
// The token expires after 1 hour
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.sendStatus(UNAUTHORIZED);
  }
  try {
    const count = await User.countDocuments({ email: email });
    if (count < 1) {
      return res.sendStatus(OK);
    }
    const token = await updateTokenDb(email)
    if (!token) {
      return res.sendStatus(INTERNAL_SERVER_ERROR);
    }

    const resetLink = generateResetLink(token);
    await notifyUser(email, resetLink);
    return res.sendStatus(OK);
  }
  catch (e) {
    console.log(e);
    return res.sendStatus(INTERNAL_SERVER_ERROR);
  }
  
});

async function updateTokenDb(email) {
  const token = crypto.randomBytes(32).toString('hex');
  try {
    await PasswordReset.updateOne(
      {
        email: email
      },
      {
        token: token,
        createdAt: Date.now()
      },
      {
        upsert: true
      }
    );
    return token;
  }
  catch (e) {
    console.log(e);
    return null;
  }
}

function generateResetLink(token) {
  const link = "http://localhost:3000/reset-password/?token=" + token;
  return link;
}

const { sendResetEmail } = require('../../cloud_api/util/mailer');
async function notifyUser(recipient, resetLink) {
  if (await !sendResetEmail(recipient, resetLink)) {
    return false;
  }
  return true;
}

// Validate reset token and return the email address for the reset password page
router.put('/validate-reset-token', async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(UNAUTHORIZED).send({
      success: false
    });
  }
  try {
    const result = await PasswordReset.findOne({
      token: token
    });
    if (!result) {
      return res.status(UNAUTHORIZED).send({
        success: false
      });
    }
    const email = result.email;
    return res.status(OK).send({
      success: true,
      email: email
    });
  } catch (e) {
    console.log(e);
    return res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

const { validatePassword, hashPassword } = require('../util/password');
// Reset password if the token is valid
router.post('/reset-password', async (req, res) => {
  const { newPassword, email, token } = req.body;
  if (!newPassword || !email || !token) {
    return res.sendStatus(UNAUTHORIZED);
  }
  // Validate new password
  const testResult = validatePassword(newPassword);
  if (!testResult.success) {
    return res.status(UNPROCESSABLE_ENTITY).json(
      {
        success: false,
        error: "invalid password",
        detail: testResult.message
      }
    );
  }

  try {
    const hashedPassword = await hashPassword(newPassword);
    // Validate reset token in DB
    const count = await PasswordReset.countDocuments({
        token: token,
        email: email
    });
    if (count < 1) {
      return res.sendStatus(UNAUTHORIZED);
    }
    // update password
    await User.updateOne(
      {
        email: email
      },
      {
        password: hashedPassword
      }
    );
    await PasswordReset.deleteOne({
      token: token
    });
    res.status(OK).send(
      {
        success: true
      }
    );
  }
  catch (e) {
    console.log(e);
    return res.sendStatus(INTERNAL_SERVER_ERROR);
  }
});

module.exports = router;
