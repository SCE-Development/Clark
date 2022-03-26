const express = require('express');
const router = express.Router();
const { Queue } = require('../../config/config.json');
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


const SqsHandler = new SceSqsApiHandler(Queue.LED_QUEUE_NAME);

router.get('/healthCheck', (req, res) => {
  res.sendStatus(OK);
});

router.post('/updateSignText', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await SqsHandler.pushMessageToQueue(req.body);
  if (result) res.sendStatus(OK);
  else res.sendStatus(BAD_REQUEST);
});


module.exports = router;
