const express = require('express');
const router = express.Router();
const {
  OK,
  SERVER_ERROR,
  BAD_REQUEST
} = require('../../util/constants.js').STATUS_CODES;
const { decodeToken } = require('../util/token-functions.js');
const logger = require('../../util/logger.js');
const {
  getAllUsers,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
} = require('../util/LeetCodeLeaderboard.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const { SIGN2 = {} } = require('../../config/config.json');

router.get('/', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  if (!SIGN2.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  const users = await getAllUsers();
  if (!users) {
    return res.sendStatus(SERVER_ERROR);
  }
  return res.status(OK).send({ users });
});

router.post('/addUser', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  if (!SIGN2.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  const { username, firstName, lastName } = req.body;
  const required = [
    { value: username, title: 'LeetCode username', },
    { value: firstName, title: 'User\'s first name', },
    { value: lastName, title: 'User\'s last name', }
  ];

  const missingValue = required.find(({ value }) => !value);

  if (missingValue) {
    return res.status(BAD_REQUEST).send(`${missingValue.title} missing from request`);
  }

  const tryAddUser = await addUserToLeaderboard({
    username,
    firstName,
    lastName
  });

  if (tryAddUser !== OK) {
    return res.status(tryAddUser).send('Error adding user to LeetCode Leaderboard');
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

  if (!SIGN2.ENABLED) {
    logger.warn('LeetCode Leaderboard is disabled, returning 200 to mock the service');
    return res.sendStatus(OK);
  }

  const { username } = req.body;
  if (!username) {
    return res.status(BAD_REQUEST).send('Username field missing');
  }

  if (!await deleteUserFromLeaderboard(username)) {
    return res.sendStatus(SERVER_ERROR);
  }

  AuditLog.create({
    userId: decoded.token._id,
    action: AuditLogActions.DELETE_LEETCODE_USER,
    details: { username },
  });
  return res.sendStatus(OK);
});

module.exports = router;
