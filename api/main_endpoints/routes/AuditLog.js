const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;

const {
  decodeToken,
  checkIfTokenSent
} = require('../util/token-functions.js');

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

  const itemsPerPage = 50;
  const page = parseInt(req.query.page) || 1;
  const skip = (page - 1) * itemsPerPage;

  const rawActions = req.query.action; // from URL, structure is: "?action=LOG_IN,SIGN_UP,PRINT_PAGE"
  const actions = rawActions ? rawActions.split(',') : []; // converts to [LOG_IN, SIGN_UP, PRINT_PAGE]

  const nameQuery = req.query.name?.trim().replace(/\s+/g, ' ');

  const query = {};
  if (actions.length > 0) {
    query.action = {$in: actions};
  }

  try {

    if (actions.length > 0) {
      query.action = {$in: actions};
    }

    if (nameQuery) {
      const allLogs = await AuditLog.find(query)
        .populate('userId', 'firstName lastName')
        .sort({createdAt: -1});

      // filter by first name, last name, or full name
      const filteredLogs = allLogs.filter(log => {
        if (!log.userId) return false;
        const firstName = log.userId.firstName || '';
        const lastName = log.userId.lastName || '';
        const fullName = `${firstName} ${lastName}`;

        return fullName.toLowerCase().includes(nameQuery.toLowerCase());
      });

      const totalLogs = filteredLogs.length;
      const items = filteredLogs.slice(skip, skip + itemsPerPage);

      res.status(OK).send({items, totalLogs});

    } else {
      const items = await AuditLog.find(query)
        .populate('userId', 'firstName lastName')
        .skip(skip)
        .limit(itemsPerPage)
        .sort({createdAt: -1});

      const totalLogs = await AuditLog.countDocuments(query);
      res.status(OK).send({items, totalLogs});
    }
  } catch (error) {
    logger.error('Failed to fetch audit logs:', error);
    res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
