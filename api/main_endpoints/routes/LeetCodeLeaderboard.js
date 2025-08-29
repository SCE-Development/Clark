const express = require('express');
const router = express.Router();
const {
  OK,
  SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST
} = require('../../util/constants.js').STATUS_CODES;
const {
  decodeToken,
  checkIfTokenSent
} = require('../util/token-functions.js');
const logger = require('../../util/logger.js');
const {
  healthCheck,
  getAllUsers,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
  checkIfUserExists,
} = require('../util/LeetCodeLeaderboard.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');

const runningInDevelopment = process.env.NODE_ENV !== 'production'
  && process.env.NODE_ENV !== 'test';

router.get('/healthCheck', async (_, res) => {
  if (runningInDevelopment) {
    return res.sendStatus(OK);
  }
  const dataFromSign = healthCheck();
  if(!dataFromSign) {
    return res.sendStatus(SERVER_ERROR);
  }
  return res.status(OK).json(dataFromSign);
});

router.get('/getAllUsers', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  if (!decodeToken(req)) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
  }

  const users = await getAllUsers();
  if (!users) {
    return res.status(SERVER_ERROR);
  }
  return res.status(OK).send({
    users,
  });
});

router.post('/addUser', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
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
    userId: decoded._id,
    action: AuditLogActions.UPDATE_SIGN, // ADD_LEETCODE_USER
    details: { username },
  });
  return res.sendStatus(OK);
});

router.post('/deleteUser', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
  }

  const { username } = req.body;
  if (!username) {
    return res.status(BAD_REQUEST).send('Username field missing');
  }

  if (!await deleteUserFromLeaderboard(username)) {
    return res.sendStatus(SERVER_ERROR);
  }

  AuditLog.create({
    userId: decoded._id,
    action: AuditLogActions.UPDATE_SIGN, // DELETE_LEETCODE_USER
    details: { username },
  });
  return res.sendStatus(OK);
});

router.post('/checkIfUserExists', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
  }

  const { username } = req.body;
  if (!username) {
    return res.status(BAD_REQUEST).send('Username field missing');
  }
  const check = await checkIfUserExists(username);
  if (check.error) {
    return res.status(check.status).send(check.message);
  }
  return res.status(OK).send(check.exists);
});

module.exports = router;
