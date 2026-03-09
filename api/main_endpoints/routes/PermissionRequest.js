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
      status: 'PENDING',
    });
    res.sendStatus(OK);
  } catch (error) {
    if (error.code === 11000) return res.sendStatus(CONFLICT);
    logger.error('Failed to create permission request:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.get('/', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.MEMBER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  const { userId: queryUserId, type } = req.query;
  const isOfficer = decoded.token.accessLevel >= membershipState.OFFICER;

  try {
    const query = { deletedAt: null };

    if (queryUserId) {
      query.userId = queryUserId;
    }
    if (!isOfficer) {
      query.userId = decoded.token._id.toString();
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

  const { _id } = req.body;
  const isOfficer = decoded.token.accessLevel >= membershipState.OFFICER;

  try {
    const query = { _id };

    if (!isOfficer) {
      query.userId = decoded.token._id;
      query.status = 'PENDING';
    }

    const request = await PermissionRequest.findOne(query);
    if (!request) return res.sendStatus(NOT_FOUND);

    // if the officer deletes a pending request, consider it denied.
    // if a user deletes their pending request, consider they gave up asking
    if (request.status === 'PENDING' && isOfficer) {
      request.status = 'DENIED';
    } else if (request.status === 'APPROVED') {
      request.status = 'REVOKED';
    }

    request.deletedAt = new Date();
    await request.save();
    res.sendStatus(OK);
  } catch (error) {
    logger.error('Failed to mark permission request as deleted:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

router.post('/approve', async (req, res) => {
  const decoded = await decodeToken(req, membershipState.OFFICER);
  if (decoded.status !== OK) return res.sendStatus(decoded.status);

  const { _id } = req.body;

  try {
    const request = await PermissionRequest.findOne({ _id, status: 'PENDING' });
    if (!request) return res.status(NOT_FOUND).send({ error: 'Pending request not found' });

    request.status = 'APPROVED';
    await request.save();
    res.sendStatus(OK);
  } catch (error) {
    logger.error('Failed to approve permission request:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;

