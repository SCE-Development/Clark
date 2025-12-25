const express = require('express');
const router = express.Router();
const {
  OK,
  SERVER_ERROR,
  UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;
const { decodeToken } = require('../util/token-functions.js');
const logger = require('../../util/logger');
const { updateSign, healthCheck, turnOffSign } = require('../util/LedSign.js');
const AuditLogActions = require('../util/auditLogActions.js');
const AuditLog = require('../models/AuditLog.js');
const {
  LED_SIGN = {}
} = require('../../config/config.json');
const { MEMBERSHIP_STATE } = require('../../util/constants.js');

const runningInTest = process.env.NODE_ENV === 'test';


router.get('/healthCheck', async (req, res) => {
  /*
  * How these work with Quasar:
  * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
  */
  if (!LED_SIGN.ENABLED && !runningInTest) {
    logger.warn('led sign is disabled, returning 200 by default');
    return res.sendStatus(OK);
  }
  const dataFromSign = await healthCheck();
  if(!dataFromSign) {
    return res.sendStatus(SERVER_ERROR);
  }
  return res.status(OK).json(dataFromSign);
});

router.post('/updateSignText', async (req, res) => {
  const decoded = await decodeToken(req, MEMBERSHIP_STATE.MEMBER);
  if (decoded.status !== OK) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(decoded.status);
  }
  if (!LED_SIGN.ENABLED && !runningInTest) {
    logger.warn('led sign is disabled, returning 200 by default');
    return res.sendStatus(OK);
  }
  // need to make this its own api endpoint
  let result = false;
  if (req.body.ledIsOff) {
    result = await turnOffSign();
    logger.info('turning sign off!');
  } else {
    logger.info('updating sign with:', req.body);
    result = await updateSign(req.body);
  }
  let status = OK;
  if(!result) {
    status = SERVER_ERROR;
  }

  await AuditLog.create({
    userId: decoded.token._id,
    action: AuditLogActions.UPDATE_SIGN,
    details: {
      newSignText: req.body.text,
    }
  }).catch(logger.error);

  return res.sendStatus(status);
});

module.exports = router;
