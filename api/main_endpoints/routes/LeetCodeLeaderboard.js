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

// middleware to abstract token decoding and enabled check
router.use(async (req, res, next) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  if (!LEETCODE_LED_SIGN.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  res.locals.userId = decoded.token._id;
  next();
});

// request handler for clark -> sign2 requests
const handleLeetCodeRequest = async (res, method, endpoint, data = null) => {
  try {
    const url = new URL(endpoint, LEETCODE_LED_SIGN_URL);
    const response = await axios({ method, url: url.href, data });

    if (response.data && 'error' in response.data) {
      throw new Error(response.data.error);
    }

    return response.data;
  } catch (err) {
    logger.error(`Error with LeetCode Leaderboard at ${endpoint}: `, err.message || err);
    res.status(SERVER_ERROR).send('Error communicating with LeetCode Leaderboard');
    return null;
  }
};

router.get('/', async (req, res) => {
  const data = await handleLeetCodeRequest(res, 'GET', '/getAllUsers');
  if (data) {
    return res.status(OK).json({ users: data.users });
  }
});

router.post('/addUser', async (req, res) => {
  const { username, firstName, lastName } = req.body;
  const data = await handleLeetCodeRequest(res, 'POST', '/user/add', { username, firstName, lastName });

  if (data) {
    AuditLog.create({
      userId: res.locals.userId,
      action: AuditLogActions.ADD_LEETCODE_USER,
      details: { username },
    });
    return res.sendStatus(OK);
  }
});

router.post('/deleteUser', async (req, res) => {
  const { username } = req.body;
  const data = await handleLeetCodeRequest(res, 'POST', '/user/remove', { username });

  if (data) {
    AuditLog.create({
      userId: res.locals.userId,
      action: AuditLogActions.DELETE_LEETCODE_USER,
      details: { username },
    });
    return res.sendStatus(OK);
  }
});

module.exports = router;
