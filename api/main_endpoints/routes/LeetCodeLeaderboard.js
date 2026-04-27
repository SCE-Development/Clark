const express = require('express');
const router = express.Router();
const {
  OK,
  SERVER_ERROR,
  BAD_REQUEST
} = require('../../util/constants.js').STATUS_CODES;
const { decodeToken } = require('../util/token-functions.js');
const logger = require('../../util/logger.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const { LEETCODE_LED_SIGN = {} } = require('../../config/config.json');
const axios = require('axios');
const LEETCODE_LED_SIGN_URL = process.env.LEETCODE_LED_SIGN_URL || 'http://localhost:12121';

router.get('/', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  if (!LEETCODE_LED_SIGN.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  try {
    const url = new URL('/getAllUsers', LEETCODE_LED_SIGN_URL);
    const { data } = await axios.get(url.href);
    if ('error' in data) {
      logger.error('Error from LeetCode Leaderboard: ', data.error);
      return res.status(SERVER_ERROR).send('Error fetching users from LeetCode Leaderboard');
    }
    return res.status(OK).json({ users: data.users });
  } catch (err) {
    logger.error('Error fetching users from LeetCode Leaderboard: ', err);
    return res.status(SERVER_ERROR).send('Error fetching users from LeetCode Leaderboard');
  }
});

router.post('/addUser', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  if (!LEETCODE_LED_SIGN.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  const { username, firstName, lastName } = req.body;

  try {
    const url = new URL('/user/add', LEETCODE_LED_SIGN_URL);
    const { data } = await axios.post(url.href, {
      username,
      firstName,
      lastName
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if ('error' in data) {
      logger.error('Error from LeetCode Leaderboard: ', data.error);
      return res.status(SERVER_ERROR).send('Error adding user to LeetCode Leaderboard');
    }
  } catch (err) {
    logger.error('Error adding user to LeetCode Leaderboard: ', err);
    return res.status(SERVER_ERROR).send('Error adding user to LeetCode Leaderboard');
  }

  AuditLog.create({
    userId: decoded.token._id,
    action: AuditLogActions.ADD_LEETCODE_USER,
    details: { username },
  });
  return res.sendStatus(OK);
});

router.post('/deleteUser', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  if (!LEETCODE_LED_SIGN.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  const { username } = req.body;

  try {
    const url = new URL('/user/remove', LEETCODE_LED_SIGN_URL);
    const { data } = await axios.post(url.href, { username }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if ('error' in data) {
      logger.error('Error from LeetCode Leaderboard: ', data.error);
      return res.status(SERVER_ERROR).send('Error deleting user from LeetCode Leaderboard');
    }
  } catch (err) {
    logger.error('Error deleting user from LeetCode Leaderboard: ', err);
    return res.status(SERVER_ERROR).send('Error deleting user from LeetCode Leaderboard');
  }

  AuditLog.create({
    userId: decoded.token._id,
    action: AuditLogActions.DELETE_LEETCODE_USER,
    details: { username },
  });
  return res.sendStatus(OK);
});

module.exports = router;
