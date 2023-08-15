const axios = require('axios');
const express = require('express');
const logger = require('../../util/logger');
const {
  verifyToken,
  checkIfTokenSent,
} = require('../../util/token-verification');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

const router = express.Router();

router.get('/healthCheck', async (req, res) => {
/*
 * How these work with Quasar:
 * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
 */
  if (process.env.NODE_ENV !== 'production') {
    return res.sendStatus(OK);
  }
  await axios
    .get('http://host.docker.internal:14000/healthcheck/printer')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(NOT_FOUND);
    });
});

router.post('/sendPrintRequest', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }

  const { raw, copies, pageRanges } = req.body;
  axios
    .post('http://host.docker.internal:14000/print', {
      raw,
      copies,
      pageRanges,
    })
    .then(() => {
      logger.warn('hello there', {
        raw: typeof raw,
        rawLength: raw.length,
        copies,
        pageRanges,
      });
      res.sendStatus(OK);
    }).catch((err) => {
      logger.error('had an error: ', err);
      res.sendStatus(500);
    });
});

module.exports = router;
