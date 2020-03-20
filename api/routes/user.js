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

const validateVerificationEmail = require('../mailer/auth')
  .validateVerificationEmail;

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
router.post('/register', function(req, res) {
  if (req.body.email && req.body.password) {
    const newUser = new User({
      password: req.body.password,
      firstName: req.body.firstName,
      middleInitial: req.body.middleInitial || '',
      lastName: req.body.lastName,
      email: req.body.email,
      major: req.body.major || ''
    });

    const membershipValidUntil = getMemberValidationDate(
      req.body.numberOfSemestersToSignUpFor
    );
    newUser.membershipValidUntil = membershipValidUntil;

    const testPassword = testPasswordStrength(req.body.password);

    if (!testPassword.success) {
      return res.status(BAD_REQUEST).send({ message: testPassword.message });
    }

    newUser.save(function(error) {
      if (error) {
        res.status(CONFLICT).send({ message: 'Username already exists.' });
      } else {
        res.sendStatus(OK);
      }
    });
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

router.post('/validateEmail', function(req, res) {
  User.findOne({ email: req.body.email }, async function(error, result) {
    if (error) {
      res.status(BAD_REQUEST).send({ message: 'Bad Request.' });
    }

    if (!result) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.email} not found.` });
    }

    const validated = await validateVerificationEmail(
      req.body.email,
      req.body.hashedId
    );
    if (validated) return res.sendStatus(OK);

    return res.sendStatus(BAD_REQUEST);
  });
});

// Edit/Update a member record
router.post('/setEmailToVerified', (req, res) => {
  const query = { email: req.body.email };

  User.updateOne(query, { emailVerified: true }, function(error, result) {
    if (error) {
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

// Helpers
function testPasswordStrength(password) {
  const passwordStrength = config.passwordStrength || 'strong';
  /* eslint-disable */
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  const strongMessage =
    'Invalid password. Requires 1 uppercase, 1 lowercase, 1 number and 1 special character: !@#$%^&'

  const mediumRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])')
  const mediumMessage =
    'Password requires one uppercase character and one number.'
  /* eslint-enable */

  // test the password against the strong regex & return true if it passes
  if (passwordStrength === 'strong') {
    return { success: strongRegex.test(password), message: strongMessage };
  }

  // allow unrestricted passwords if strength is set to weak
  if (passwordStrength === 'weak') {
    return { success: true, message: '' };
  }

  // test medium password by default
  return { success: mediumRegex.test(password), message: mediumMessage };
}

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

function getMemberValidationDate(numberOfSemestersToSignUpFor) {
  const today = new Date();
  const membershipValidationDate = new Date();

  // August 1st - January 31st
  const startOfFallMonth = 8;
  const endOfFallMonth = 1;
  const endOfFallDay = 31;

  // January 1st - August 31st
  const startOfSpringMonth = 1;
  const endOfSpringMonth = 8;
  const endOfSpringDay = 31;

  const isFallSemester =
    today.getMonth() >= startOfFallMonth &&
    today.getMonth() < startOfSpringMonth + 12;

  if (isFallSemester) {
    if (numberOfSemestersToSignUpFor === 1) {
      // months are zero indexed??
      membershipValidationDate.setMonth(endOfFallMonth - 1);
      membershipValidationDate.setDate(endOfFallDay);
      membershipValidationDate.setFullYear(
        membershipValidationDate.getFullYear() + 1
      ); // set to next year
    } else if (numberOfSemestersToSignUpFor === 2) {
      membershipValidationDate.setMonth(endOfSpringMonth - 1);
      membershipValidationDate.setDate(endOfSpringDay);
      membershipValidationDate.setFullYear(
        membershipValidationDate.getFullYear() + 1
      ); // set to next year
    }
  } else {
    if (numberOfSemestersToSignUpFor === 1) {
      membershipValidationDate.setMonth(endOfSpringMonth - 1);
      membershipValidationDate.setDate(endOfSpringDay);
    } else if (numberOfSemestersToSignUpFor === 2) {
      membershipValidationDate.setMonth(endOfFallMonth - 1);
      membershipValidationDate.setDate(endOfFallDay);
      membershipValidationDate.setFullYear(
        membershipValidationDate.getFullYear() + 1
      ); // set to next year
    }
  }

  return membershipValidationDate;
}

module.exports = router;
