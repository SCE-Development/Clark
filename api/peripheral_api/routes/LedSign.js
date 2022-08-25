const express = require('express');
const router = express.Router();
const {
  OK,
  SERVER_ERROR,
  UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;
const {
  verifyToken,
  checkIfTokenSent
} = require('../../util/token-verification');
const logger = require('../../util/logger');
const { updateSign, healthCheck, turnOffSign } = require('../util/LedSign.js');

const runningInDevelopment = process.env.NODE_ENV !== 'production'
  && process.env.NODE_ENV !== 'test';


router.get('/healthCheck', async (req, res) => {
  /*
  * How these work with Quasar:
  * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
  */
  if (!checkIfTokenSent(req)) {
    logger.warn('/healthCheck was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/healthCheck was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (runningInDevelopment) {
    return res.sendStatus(OK);
  }
  const dataFromSign = await healthCheck();
  if(!dataFromSign) {
    return res.sendStatus(SERVER_ERROR);
  }
  return res.status(OK).json(dataFromSign);
});

router.post('/updateSignText', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/updateSignText was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (runningInDevelopment) {
    return res.sendStatus(OK);
  }
  // need to make this its own api endpoint
  let result = false;
  if (req.body.ledIsOff) {
    result = await turnOffSign();
    logger.info("turning sign off!");
  } else {
    logger.info("updating sign with:", req.body);
    result = await updateSign(req.body);
  }
  let status = OK;
  if(!result) {
    status = SERVER_ERROR;
  }
  return res.sendStatus(status);
});


module.exports = router;
