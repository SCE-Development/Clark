'use strict';

const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../util/passport')(passport);
const User = require('../models/User.js');
const axios = require('axios');
const { getMemberExpirationDate} = require('../util/registerUser');
const { checkDiscordKey } = require('../../util/token-verification');
const {
  checkIfTokenSent,
  checkIfTokenValid,
  decodeToken,
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
const { addErrorLog }  = require('../util/logging-helpers');
const discordConnection = require('../util/discord-connection');

const discordRedirectUri = process.env.DISCORD_REDIRECT_URI ||
  'http://localhost:8080/api/user/callback';

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
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
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
  } else if (!checkIfTokenValid(req, membershipState.ALUMNI)) {
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
    .then((items) => {
      res.status(OK).send(items);
    })
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

  if (!req.body.email) {
    return res.sendStatus(BAD_REQUEST);
  }

  let decoded = decodeToken(req);
  if (decoded.accessLevel === membershipState.MEMBER) {
    if (req.body.email && req.body.email != decoded.email) {
      return res.status(UNAUTHORIZED).send('Unauthorized to edit another user');
    }
    if (req.body.accessLevel && req.body.accessLevel !== decoded.accessLevel) {
      return res
        .status(UNAUTHORIZED)
        .send('Unauthorized to change access level');
    }
  }

  if (decoded.accessLevel === membershipState.OFFICER) {
    if (req.body.accessLevel && req.body.accessLevel == membershipState.ADMIN) {
      return res.sendStatus(UNAUTHORIZED);
    }
  }

  const query = { email: req.body.email };
  let user = req.body;

  if (typeof req.body.numberOfSemestersToSignUpFor !== 'undefined') {
    user.membershipValidUntil = getMemberExpirationDate(
      parseInt(req.body.numberOfSemestersToSignUpFor)
    );
  }

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
  discordConnection
    .loginWithDiscord(code, email, discordRedirectUri)
    .then((status) => {
      return res.status(OK).redirect('https://discord.com/oauth2/authorized');
    })
    .catch((_) => {
      return res.status(NOT_FOUND).send('Authorization unsuccessful!');
    });
});

router.post('/getUserFromDiscordId', (req, res) => {
  const { discordID, apiKey } = req.body;
  if (!checkDiscordKey(apiKey)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  User.findOne({ discordID }, (error, result) => {
    let status = OK;
    if (error) {
      status = BAD_REQUEST;
    } else if (!result) {
      status = NOT_FOUND;
    }
    return res.status(status).send(result);
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
  if (
    discordApiKeys.CLIENT_ID === 'NOT_SET' &&
    discordApiKeys.CLIENT_SECRET === 'NOT_SET'
  ) {
    return res.sendStatus(OK);
  }
  return res
    .status(OK)
    .send(
      'https://discord.com/api/oauth2/authorize?client_id=' +
        `${discordApiKeys.CLIENT_ID}` +
        `&redirect_uri=${encodeURIComponent(discordRedirectUri)}` +
        `&state=${email}&response_type=code&scope=identify`
    );
});

module.exports = router;
