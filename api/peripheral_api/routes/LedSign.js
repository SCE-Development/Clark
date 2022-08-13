const express = require('express');
const router = express.Router();
const { AWS } = require('../../config/config.json');
const { SceSqsApiHandler } = require('../util/SceSqsApiHandler');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED
} = require('../../util/constants').STATUS_CODES;
const {
  verifyToken,
  checkIfTokenSent
} = require('../../util/token-verification');
const logger = require('../../util/logger');

const SqsHandler = new SceSqsApiHandler(AWS.Queue.LED_QUEUE_NAME);

router.get('/healthCheck', (req, res) => {
  res.sendStatus(OK);
});

router.post('/updateSignText', async (req, res) => {
  if (!AWS.ENABLED) {
    logger.warn('AWS is not enabled');
    return res.sendStatus(OK);
  }

  if (!checkIfTokenSent(req)) {
    logger.warn('/updateSignText was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await SqsHandler.pushMessageToQueue(req.body);
  if (result) {
    res.sendStatus(OK);
  } else {
    res.sendStatus(BAD_REQUEST);
  }
});


module.exports = router;
