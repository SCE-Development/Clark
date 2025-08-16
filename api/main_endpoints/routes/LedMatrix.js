const express = require('express');
const router = express.Router();
const {
  OK,
  SERVER_ERROR,
  UNAUTHORIZED,
  FORBIDDEN,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;
const {
  decodeToken,
  checkIfTokenSent
} = require('../util/token-functions.js');
const logger = require('../../util/logger');
const {
  healthCheck,
  addUserToLeaderboard,
  deleteUserFromLeaderboard,
  updateLeaderboardUser,
  addAnnouncement,
  deleteAnnouncement
} = require('../util/LedMatrix.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');

const runningInDevelopment = process.env.NODE_ENV !== 'production'
  && process.env.NODE_ENV !== 'test';

router.get('/healthCheck', async (_, res) => {
  if (runningInDevelopment) {
    return res.sendStatus(OK);
  }
  const dataFromSign = await healthCheck();
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

  // query the pi to get all users
  // no need for audit log
});

router.post('addUser', async (req, res) => {
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

  if (!addUserToLeaderboard({
    username,
    first_name: firstName,
    last_name: lastName
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

router.post('deleteUser', async (req, res) => {
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

  if (!deleteUserFromLeaderboard(username)) {
    return res.sendStatus(SERVER_ERROR);
  }

  AuditLog.create({
    userId: decoded._id,
    action: AuditLogActions.UPDATE_SIGN, // DELETE_LEETCODE_USER
    details: { username },
  });
  return res.sendStatus(OK);
});

router.post('updateUser', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
  }

  const { oldUser, newUser } = req.body;
  // add check for missing stuff

  if (!updateLeaderboardUser(oldUser, newUser)) {
    return res.sendStatus(SERVER_ERROR);
  }

  AuditLog.create({
    userId: decoded._id,
    action: AuditLogActions.UPDATE_SIGN, // UPDATE_LEETCODE_USER
    details: { username },
  });
  return res.sendStatus(OK);

});

router.post('addAnnouncement', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
  }

  const { announcement } = req.body;
  if (!announcement) {
    return res.status(BAD_REQUEST).send('Announcement field missing');
  }

  if (!addAnnouncement(announcement)) {
    return res.sendStatus(SERVER_ERROR);
  }

  AuditLog.create({
    userId: decoded._id,
    action: AuditLogActions.UPDATE_SIGN, // ADD_ANNOUNCEMENT
    details: { announcement },
  });
  return res.sendStatus(OK);
});

router.post('deleteAnnouncement', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.status(FORBIDDEN).send('Missing API token');
  }
  const decoded = decodeToken(req);
  if (!decoded) {
    return res.status(UNAUTHORIZED).send('Invalid API token');
  }

  const { announcement } = req.body;
  if (!announcement) {
    return res.status(BAD_REQUEST).send('Announcement field missing');
  }

  if (!deleteAnnouncement(announcement)) {
    return res.sendStatus(SERVER_ERROR);
  }

  AuditLog.create({
    userId: decoded._id,
    action: AuditLogActions.UPDATE_SIGN, // DELETE_ANNOUNCEMENT
    details: { announcement },
  });
  return res.sendStatus(OK);
});

module.exports = router;
