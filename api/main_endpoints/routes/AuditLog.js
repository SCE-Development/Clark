const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const { OK, UNAUTHORIZED, SERVER_ERROR } = require('../../util/constants').STATUS_CODES;

const { checkIfTokenSent, checkIfTokenValid } = require('../util/token-functions.js');

const logger = require('../../util/logger');

router.get('/getAuditLogs', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/getAuditLogs was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const isValid = checkIfTokenValid(req, 2);

  if (!isValid) {
    logger.warn('/getAuditLogs was requested with an invalid or unauthorized token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const itemsPerPage = 50;
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
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
