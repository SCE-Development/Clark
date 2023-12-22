'use strict';
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const config = require('../../config/config.json');
const User = require('../models/User.js');
const { registerUser } = require('../util/userHelpers');
const {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken
} = require('../util/token-functions');
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
const {sendVerificationEmail} = require('../util/emailHelpers');
const { userWithEmailExists, checkIfPageCountResets } = require('../util/userHelpers');

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
    const name = req.body.firstName + ' ' + req.body.lastName;
    sendVerificationEmail(name, req.body.email);
    res.sendStatus(OK);
  }
});

router.post('/resendVerificationEmail', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const maybeUser = await userWithEmailExists(req.body.email);
  if (!maybeUser) {
    return res.sendStatus(NOT_FOUND);
  }
  let name = maybeUser.firstName + ' ' + maybeUser.lastName;
  sendVerificationEmail(name, req.body.email);
  res.sendStatus(OK);
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
            if (!user.emailVerified) {
              return res
                .status(UNAUTHORIZED)
                .send({ message: 'Email has not been verified' });
            }

            // If the username and password matches the database, assign and
            // return a jwt token
            const jwtOptions = {
              expiresIn: '2h'
            };

            // check here to see if we should reset the pagecount. If so, do it
            if (checkIfPageCountResets(user.lastLogin)) {
              user.pagesPrinted = 0;
            }

            // Include fields from the User model that should
            // be passed to the JSON Web Token (JWT)
            const userToBeSigned = {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              accessLevel: user.accessLevel,
              pagesPrinted: user.pagesPrinted,
              _id: user._id
            };
            user
              .save()
              .then(() => {
                const token = jwt.sign(
                  userToBeSigned, config.secretKey, jwtOptions
                );
                res.json({ token: 'JWT ' + token });
              })
              .catch((error) => {
                logger.error('unable to login user', error);
                res.sendStatus(SERVER_ERROR);
              });
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

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
// Returns the name and accesslevel of the user w/ the given access token
router.post('/verify', function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.status(UNAUTHORIZED).json({});
  }
  const token = decodeToken(req);
  if (token === null || Object.keys(token).length === 0) {
    res.status(UNAUTHORIZED).json({});
  } else {
    res.status(OK).json(token);
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

module.exports = router;
