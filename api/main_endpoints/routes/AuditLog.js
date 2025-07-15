const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { OK, BAD_REQUEST, UNAUTHORIZED } = require('../../util/constants').STATUS_CODES;

const { decodeToken, checkIfTokenSent } = require('../util/token-functions.js');

const logger = require('../../util/logger');

router.get('/getAuditLogs', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/getAuditLogs was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const decodedPayload = await decodeToken(req);

  if (!decodedPayload) {
    logger.warn('/getAuditLogs was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }

  if (decodedPayload.accessLevel < 2) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const itemsPerPage = 5;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * itemsPerPage;

  try {
    const items = await AuditLog.find({})
      .populate('userId', 'firstName lastName')
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });

    const totalLogs = await AuditLog.countDocuments({});
    res.status(OK).send({ items, totalLogs });
  } catch (error) {
    logger.error('Failed to fetch audit logs:', error);
    res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
