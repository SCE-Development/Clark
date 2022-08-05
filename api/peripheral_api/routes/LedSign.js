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


const SqsHandler = new SceSqsApiHandler(AWS.Queue.LED_QUEUE_NAME);

router.get('/healthCheck', (req, res) => {
  res.sendStatus(OK);
});

router.post('/updateSignText', async (req, res) => {
  if (!AWS.ENABLED) return res.sendStatus(OK);
  console.log(req.body.token)
	if (!checkIfTokenSent(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
	console.log("was sent cool", await verifyToken(req.body.token))
  if (!await verifyToken(req.body.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }
	console.log("we out here", )
  const result = await SqsHandler.pushMessageToQueue(req.body);
	console.log("result woooooo")
  if (result) res.sendStatus(OK);
  else res.sendStatus(BAD_REQUEST);
});


module.exports = router;
