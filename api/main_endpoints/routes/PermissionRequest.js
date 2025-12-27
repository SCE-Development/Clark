const express = require('express');
const router = express.Router();
const PermissionRequest = require('../models/PermissionRequest');
const { OK, UNAUTHORIZED, SERVER_ERROR, NOT_FOUND, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants.js').MEMBERSHIP_STATE;
const { decodeToken } = require('../util/token-functions.js');
const logger = require('../../util/logger');
const PermissionRequestTypes = require('../util/permissionRequestTypes');

router.post('/create', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.MEMBER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  const { type } = req.body;
  if (!type || !Object.keys(PermissionRequestTypes).includes(type)) {
    return res.status(BAD_REQUEST).send({ error: 'Invalid type' });
  }

  try {
    const permissionRequest = await PermissionRequest.create({
      userId: decoded.token._id,
      type,
    });
    const populated = await PermissionRequest.findById(permissionRequest._id)
      .populate('userId', 'firstName lastName email');
    res.status(OK).send(populated);
  } catch (error) {
    if (error.code === 11000) return res.status(BAD_REQUEST).send({ error: 'Request already exists' });
    logger.error('Failed to create permission request:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/getAll', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  try {
    const requests = await PermissionRequest.find({ deletedAt: null })
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });
    res.status(OK).send(requests);
  } catch (error) {
    logger.error('Failed to get permission requests:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/get', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.MEMBER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  try {
    const request = await PermissionRequest.findOne({
      userId: decoded.token._id,
      type: req.query.type,
      deletedAt: null,
    }).populate('userId', 'firstName lastName email');

    if (!request) return res.sendStatus(NOT_FOUND);
    res.status(OK).send(request);
  } catch (error) {
    logger.error('Failed to get permission request:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.post('/delete', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.MEMBER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  const { type } = req.body;
  if (!type || !Object.keys(PermissionRequestTypes).includes(type)) {
    return res.status(BAD_REQUEST).send({ error: 'Invalid type' });
  }

  try {
    const request = await PermissionRequest.findOne({
      userId: decoded.token._id,
      type,
      deletedAt: null,
    });
    if (!request) return res.sendStatus(NOT_FOUND);
    request.deletedAt = new Date();
    await request.save();
    res.sendStatus(OK);
  } catch (error) {
    logger.error('Failed to delete permission request:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;

