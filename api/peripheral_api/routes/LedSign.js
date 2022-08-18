const express = require('express');
const router = express.Router();
const { AWS } = require('../../config/config.json');
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

router.get('/healthCheck', async (req, res) => {
  /*
  * How these work with Quasar:
  * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
  */
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
  if (!AWS.ENABLED) {
    logger.warn('/updateSignText returning 200 because AWS is not enabled');
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
  if (process.env.NODE_ENV !== 'production') {
    return res.sendStatus(OK);
  }
  await axios
    .post('http://host.docker.internal:11000/api/update-sign' {...req.body})
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      return res.sendStatus(NOT_FOUND);
    });
});


module.exports = router;
