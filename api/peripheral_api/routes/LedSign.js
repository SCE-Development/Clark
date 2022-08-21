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
const { updateSign, healthCheck } = require('../../util/LedSign.js');



router.get('/healthCheck', async (req, res) => {
  /*
  * How these work with Quasar:
  * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
  */
  if (process.env.NODE_ENV !== 'production') {
    return res.sendStatus(OK);
  }
  isUp = await healthCheck();
  if(usUp) return 200
  return 500
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
  if (process.env.NODE_ENV !== 'production') {
    return res.sendStatus(OK);
  }
  isUp = await updateSign(..req.body);
  if(usUp) return 200
  return 500
});


module.exports = router;
