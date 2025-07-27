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
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const logger = require('../../util/logger');

// Search for all members using either first name, last name or email
router.post('/', async function(req, res) {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  if (!req.body.query) {
    return res.status(OK).send({ items: [] });
  }

  const query = req.body.query.replace(/[*\s]/g, '');

  // Create a fuzzy regex pattern to match characters in order, e.g., "pone" -> /p.*o.*n.*e/i
  const fuzzyPattern = query.split('').join('.*');
  const pattern = new RegExp(fuzzyPattern, 'i');

  const maybeOr = {
    $or: [
      {
        $expr: {
          $regexMatch: {
            input: { $concat: ['$firstName', '$lastName'] },
            regex: pattern,
          }
        }
      },
      { email: { $regex: new RegExp(query, 'i')} }
    ]
  };

  /**
   * Function to calculate scores based on token matches for sorting
   * @param {string} str - The string to score against
   * @param {Array} tokens - The tokens to match against the string
   * @return {number} - The score based on matches
   */
  const tokenScores = (str, tokens) => {
    return tokens.reduce((score, token) => {
      if (str.startsWith(token)) return score + 0; // highest score for exact match
      if (str.includes(token)) return score + 1; // lower score for partial match
      return score + 2; // lowest score for no match
    }, 0);
  };

  /**
   * Sorts the user items based on the query match
   * @param {string} query input string to match against
   * @returns {function} - A comparison function for sorting
   */
  const sortByMatch = (query) => {
    const input = query.toLowerCase().split(/[\s@._-]+/).filter(Boolean);

    return (a, b) => {
      const aName = (a.firstName + ' ' + a.lastName).toLowerCase();
      const bName = (b.firstName + ' ' + b.lastName).toLowerCase();
      const aEmail = a.email.toLowerCase();
      const bEmail = b.email.toLowerCase();

      // First Priority: sort by name match
      const nameScoreA = tokenScores(aName, input);
      const nameScoreB = tokenScores(bName, input);
      if (nameScoreA !== nameScoreB) {
        return nameScoreA - nameScoreB;
      }

      // Second Priority: sort by email match
      const emailScoreA = tokenScores(aEmail, input);
      const emailScoreB = tokenScores(bEmail, input);
      if (emailScoreA !== emailScoreB) {
        return emailScoreA - emailScoreB;
      }

      // Tie-breaker: alphabetical email sort
      return a.email.localeCompare(b.email);
    };
  };

  // Find user and sort results based on best match of full name or email
  User.find(maybeOr, { password: 0 })
    .limit(5)
    .then(items => {
      items.sort(sortByMatch(req.body.query));
      res.status(OK).send({ items });
    })
    .catch((error) => {
      logger.error('/shortcutsearchusers encountered an error:', error);
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
