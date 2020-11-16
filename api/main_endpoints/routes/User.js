'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const User = require('../models/User.js');
const axios = require('axios');
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
} = require('../../util/constants').STATUS_CODES;
const {
  discordApiKeys
} = require('../../config/config.json');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const addErrorLog = require('../util/logging-helpers');
const discordConnection = require('../util/discord-connection');

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

// Delete a member
router.post('/delete', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.ADMIN)) {
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
      discordUsername: result.discordUsername,
      discordDiscrim: result.discordDiscrim,
      discordID: result.discordID,
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
  } else if (!checkIfTokenValid(req, membershipState.ADMIN)) {
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

router.get('/callback', async function(req, res) {
  const code = req.query.code;
  const email = req.query.state;
  discordConnection.loginWithDiscord(code, email)
    .then(status => {
      return res.status(OK).redirect('https://discord.com/oauth2/authorized');
    })
    .catch(_ => {
      return res.status(NOT_FOUND).send('Authorization unsuccessful!');
    });
});

router.post('/connectToDiscord', function(req, res) {
  const email = req.body.email;
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!email) {
    return res.sendStatus(BAD_REQUEST);
  }
  return res.status(OK)
    .send('https://discord.com/api/oauth2/authorize?client_id=' +
      `${discordApiKeys.CLIENT_ID}` +
      `&redirect_uri=${discordApiKeys.REDIRECT_URI_DEV}` +
      `&state=${email}`);
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
