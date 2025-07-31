'use strict';

const express = require('express');
const router = express.Router();
const User = require('../models/User.js');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions');
const {
  OK,
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const logger = require('../../util/logger');
const { Cleezy } = require('../../config/config.json');
const { ENABLED } = Cleezy;
const cleezy = require('../routes/Cleezy.js');

// Search for all members using either first name, last name or email
// Search for all cleezy urls using either alias or url
router.post('/', async function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  if (!req.body.query) {
    return res.status(OK).send({
      items: {
        users: [],
        cleezyData: [],
      }
    });
  }

  // function for calculating how similar strings are to each other via levenshtein distance
  function levenshteinDistance(a, b) {
    const m = a.length;
    const n = b.length;

    if (m === 0) return n;
    if (n === 0) return m;

    const dp = Array.from({ length: m + 1 }, () => Array(n + 1));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + cost
        );
      }
    }
    return dp[m][n];
  }

  // Find top 5 matching users and sort results based on best match of name or email
  User.find({}, { password: 0 })
    .then(users => {
      const matchingUsers = users.map(user => {
        const firstNameScore = levenshteinDistance(req.body.query, user.firstName);
        const lastNameScore = levenshteinDistance(req.body.query, user.lastName);
        const emailScore = levenshteinDistance(req.body.query, user.email);
        return {
          user,
          score: Math.min(firstNameScore, lastNameScore, emailScore)
        };
      });

      const items = matchingUsers
        .sort((a, b) => a.score - b.score)
        .slice(0, 5)
        .map(item => item.user);
      res.status(OK).send({ items });
    })
    .catch((error) => {
      logger.error('/shortcutsearchusers encountered an error:', error);
      res.sendStatus(BAD_REQUEST);
      // Tie-breaker: alphabetical email sort
      return a.email.localeCompare(b.email);
    };
  };

  // Find user and sort results based on best match of full name or email
  try{
    const users = await User.find(maybeOr, { password: 0 }).limit(5);
    users.sort(sortByMatch(req.body.query));

    // Short circuit if cleezy is disabled
    if(!ENABLED) {
      return res.status(OK).json({
        items: {users, cleezyData: []},
        disabled: true
      });
    }

    const cleezyRes = await cleezy.searchCleezyUrls(req);
    if (cleezyRes.status !== OK) {
      logger.warn('Cleezy search failed', {
        status: cleezyRes.status
      });

      return res.status(OK).send({
        cleezyStatus: cleezyRes.status,
        items: { users }
      });
    }

    return res.status(OK).send({
      items: {
        users,
        cleezyData: cleezyRes.data,
      }
    });
  } catch (error) {
    logger.error('/shortcutsearch encountered an error:', { error, query: req.body.query });
    if (error.response && error.response.data) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(SERVER_ERROR).json({ error: 'Failed to search for Users or URLs' });
    }
  }
});

module.exports = router;
