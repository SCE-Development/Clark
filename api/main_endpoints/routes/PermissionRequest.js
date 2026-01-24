const express = require('express');
const router = express.Router();
const PermissionRequest = require('../models/PermissionRequest');
const { OK, UNAUTHORIZED, SERVER_ERROR, NOT_FOUND, BAD_REQUEST, CONFLICT } = require('../../util/constants').STATUS_CODES;
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
    await PermissionRequest.create({
      userId: decoded.token._id,
      type,
    });
    res.sendStatus(OK);
  } catch (error) {
    if (error.code === 11000) return res.sendStatus(CONFLICT);
    logger.error('Failed to create permission request:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/get', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.MEMBER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  const { userId: queryUserId, type } = req.query;
  const isOfficer = decoded.token.accessLevel >= membershipState.OFFICER;

  try {
    const query = { deletedAt: null };

    if (!isOfficer) {
      query.userId = decoded.token._id.toString();
    } else {
      if (queryUserId) {
        query.userId = queryUserId;
      }
    }

    // If there is a type, filter by it
    if (type && Object.keys(PermissionRequestTypes).includes(type)) {
      query.type = type;
    }

    const requests = await PermissionRequest.find(query)
      .populate('userId', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(OK).send(requests);
  } catch (error) {
    logger.error('Failed to get permission requests:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.post('/delete', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.MEMBER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  const { type, _id } = req.body;
  if (!type || !Object.keys(PermissionRequestTypes).includes(type)) {
    return res.status(BAD_REQUEST).send({ error: `${type} is an invalid type, try 
      ${Object.keys(PermissionRequestTypes)}` });
  }

  try {
    let idToUse = _id;

    if (!idToUse) {
      idToUse = decoded.token._id;
    }

    if (decoded.token.accessLevel < membershipState.OFFICER) {
      idToUse = decoded.token._id;
    }

    const query = {
      _id: idToUse,
      type,
      deletedAt: null,
    };

    const request = await PermissionRequest.findOne(query);

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

