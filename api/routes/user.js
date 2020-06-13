'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const settings = require('../util/settings');
const logger = require(`${settings.util}/logger`);
const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/User.js');
const { registerUser } = require('../util/registerUser');
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
  CONFLICT
} = require('../constants').STATUS_CODES;
const membershipState = require('../constants').MEMBERSHIP_STATE;
const addErrorLog = require ('../util/logging-helpers');

router.post('/checkIfUserExists', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.sendStatus(BAD_REQUEST);
  }
  User.findOne(
    {
      email: email.toLowerCase()
    },
    function(error, user) {
      if (error) {
        logger.log(`User /user/checkIfUserExists error: ${error}`);
        return res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      }

      if (!user) {
        // Member username does not exist
        res.sendStatus(OK);
      } else {
        // User username does exist
        res.sendStatus(CONFLICT);
      }
    }
  );
});

// Register a member
router.post('/register', async (req, res) => {
  const registrationStatus = await registerUser(req.body);
  if(!registrationStatus.userSaved) {
    if(registrationStatus.status === 'BAD_REQUEST') {
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
        logger.log('User API bad request: ', error);
        return res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
      }

      if (!user) {
        logger.log('User/pass doesn\'t match our records: ', req.body.email);
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
                { pagesPrinted: 0 },
                function(error, result) {
                  // if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)
                  if (error) {
                    logger.log(
                      'Bad request while trying to reset pageCount to 0 for ' +
                        user.email
                    );
                  }

                  if (result.nModified < 1) {
                    return logger.log(
                      `Cannot update ${user.email}, email was not found.`
                    );
                  }
                }
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
            // Unauthorized
            logger.log('User/pass doesn\'t match our records: ', user);
            res.status(UNAUTHORIZED).send({
              message: 'Username or password does not match our records.'
            });
          }
        });
      }
    }
  );
});

// Delete a member
router.post('/delete', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  User.deleteOne({ email: req.body.email }, function(error, user) {
    if (error) {
      const info = {
        userEmail: req.body.email,
        errorTime: new Date(),
        apiEndpoint: 'user/delete',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (user.n < 1) {
      res.status(NOT_FOUND).send({ message: 'User not found.' });
    } else {
      res.status(OK).send({ message: `${req.body.email} was deleted.` });
    }
  });
});

// Search for a member
router.post('/search', function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (!result) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }

    const user = {
      firstName: result.firstName,
      middleInitial: result.middleInitial,
      lastName: result.lastName,
      email: result.email,
      emailVerified: result.emailVerified,
      emailOptIn: result.emailOptIn,
      active: result.active,
      accessLevel: result.accessLevel,
      major: result.major,
      joinDate: result.joinDate,
      lastLogin: result.lastLogin,
      membershipValidUntil: result.membershipValidUntil,
      pagesPrinted: result.pagesPrinted,
      doorCode: result.doorCode
    };
    return res.status(OK).send(user);
  });
});

// Search for all members
router.post('/users', function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.find()
    .sort({ joinDate: -1 })
    .then(items => res.status(OK).send(items))
    .catch(() => {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    });
});

// Edit/Update a member record
router.post('/edit', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const query = { email: req.body.email };
  const user =
    typeof req.body.numberOfSemestersToSignUpFor === 'undefined'
      ? { ...req.body }
      : {
        ...req.body,
        membershipValidUntil: getMemberValidationDate(
          parseInt(req.body.numberOfSemestersToSignUpFor)
        )
      };

  delete user.numberOfSemestersToSignUpFor;

  // Remove the auth token from the form getting edited
  delete user.token;

  User.updateOne(query, { ...user }, function(error, result) {
    if (error) {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'user/edit',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${query.email} not found.` });
    }

    return res.status(OK).send({
      message: `${query.email} was updated.`,
      membershipValidUntil: user.membershipValidUntil
    });
  });
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

router.post('/getPagesPrintedCount', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.findOne({ email: req.body.email }, function(error, result) {
    if (error) {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'user/PagesPrintedCount',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (!result) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }
    return res.status(OK).json(result.pagesPrinted);
  });
});

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
// Returns the name and accesslevel of the user w/ the given access token
router.post('/verify', function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const decoded = checkIfTokenValid(req);
  if (decoded) {
    res.status(OK).send(decoded);
  } else {
    res.sendStatus(UNAUTHORIZED);
  }
});

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

module.exports = router;
