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
  checkIfUserExists,
} = require('../util/LeetCodeLeaderboard.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

router.get('/getAllUsers', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
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

  if (!await addUserToLeaderboard({
    username,
    firstName,
    lastName
  })) {
    return res.sendStatus(SERVER_ERROR);
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

router.post('/checkIfUserExists', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) {
    return res.sendStatus(decoded.status);
  }

  const { username } = req.body;
  if (!username) {
    return res.status(BAD_REQUEST).send('Username field missing');
  }
  const response = await checkIfUserExists(username);
  if (response.error) {
    return res.status(response.status).send(response.message);
  }
  return res.status(OK).send(response.exists);
});

module.exports = router;
