'use strict';
const bcrypt = require('bcryptjs');
const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const config = require('../../config/config.json');
const User = require('../models/User.js');
const { registerUser } = require('../util/registerUser');
const {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken
} = require('../util/token-functions');
const jwt = require('jsonwebtoken');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  NOT_FOUND,
  CONFLICT
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const addErrorLog = require('../util/logging-helpers');

/**
 * Check if a Sunday has passed in between the user's last login date and
 * today's date. This is because the printing pages reset every Sunday.
 * @param {Date} lastLogin the date when the user last logged in
 * @returns {Boolean} returns boolean representing if the pages need to be
 * reset
 */
function checkIfPageCountResets(lastLogin) {
  if (!lastLogin) return false;

  let date = new Date(lastLogin.getTime());
  const newDate = new Date();
  let isSunday = false;

  // If last login was today, don't check.
  if (date.toDateString() === newDate.toDateString()) {
    return false;
  }

  while (date <= newDate) {
    let day = date.getDay();
    isSunday = (day === 0);
    if (isSunday) {
      return true;
    }
    date.setDate(date.getDate() + 1);
  }

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
    return res.status(UNAUTHORIZED).json({});
  }
  const token = decodeToken(req);
  if (!token) {
    res.status(UNAUTHORIZED).json(token);
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
