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
  if (process.env.NODE_ENV !== 'production') {
     return res.sendStatus(OK);
   }

   await axios
     .get('http://host.docker.internal:11000/api/health-check')
     .then(() => {
       return res.sendStatus(OK);
     })
     .catch((err) => {
       return res.sendStatus(NOT_FOUND);
     });
});

router.post('/updateSignText', async (req, res) => {
  if (!AWS.ENABLED) return res.sendStatus(OK);
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
