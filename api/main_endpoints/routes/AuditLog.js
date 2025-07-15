const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

const { OK, UNAUTHORIZED, SERVER_ERROR } = require('../../util/constants').STATUS_CODES;
const { OFFICER } = require('../../util/constants.js').MEMBERSHIP_STATE;

const { checkIfTokenSent, checkIfTokenValid } = require('../util/token-functions.js');

const logger = require('../../util/logger');
const User = require('../models/User.js');

router.get('/getAuditLogs', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/getAuditLogs was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const isValid = checkIfTokenValid(req, OFFICER);

  if (!isValid) {
    logger.warn('/getAuditLogs was requested with an invalid or unauthorized token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const itemsPerPage = 50;
  const page = parseInt(req.query.page) || 0; // page is 0-based
  const skip = page * itemsPerPage;

  const rawActions = req.query.action; // from URL, structure is: "?action=LOG_IN,SIGN_UP,PRINT_PAGE"
  const actions = rawActions ? rawActions.split(',') : []; // converts to [LOG_IN, SIGN_UP, PRINT_PAGE]

  const firstNameQuery = req.query.firstName?.trim();
  const lastNameQuery = req.query.lastName?.trim();

  const query = {};
  if (actions.length > 0) {
    query.action = { $in: actions };
  }

  try {
    if (firstNameQuery || lastNameQuery) {
      const userFilter = {};

      if (firstNameQuery) userFilter.firstName = new RegExp(firstNameQuery, 'i');
      if (lastNameQuery) userFilter.lastName = new RegExp(lastNameQuery, 'i');

      const users = await User.find(userFilter).select('_id');
      const userIds = users.map(u => u._id);

      if (userIds.length === 0) {
        return res.status(OK).send({ items: [], totalLogs: 0 });
      }

      query.userId = { $in: userIds };
    }

    const items = await AuditLog.find(query)
      .populate('userId', 'firstName lastName')
      .skip(skip)
      .limit(itemsPerPage)
      .sort({ createdAt: -1 });

    const totalLogs = await AuditLog.countDocuments(query);
    res.status(OK).send({ items, totalLogs });
  } catch (error) {
    logger.error('Failed to fetch audit logs:', error);
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
