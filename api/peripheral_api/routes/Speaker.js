const express = require('express');
const axios = require('axios');
const router = express.Router();
const { speakerQueued } = require('../util/Speaker.js');
const {
  verifyToken,
  checkIfTokenSent,
} = require('../../util/token-verification');
const {
  OK,
  UNAUTHORIZED,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');
let SPEAKER_URL = process.env.SPEAKER_URL
  || 'http://localhost:8000';

router.post('/stream', async (req, res) => {
  logger.error('IT IS HERE');
  if (!checkIfTokenSent(req)) {
    logger.warn('/stream was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/stream was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  await axios
    .post(SPEAKER_URL + '/stream', {'url' : req.body.url})
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('/Speaker/stream had an error: ', err);
      return res.sendStatus(SERVER_ERROR);
    });
});

router.post('/pause', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/pause was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/pause was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  await axios
    .post(SPEAKER_URL + '/pause')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      return res.sendStatus(SERVER_ERROR);
    });
});

router.post('/resume', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/resume was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/resume was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  await axios
    .post(SPEAKER_URL + '/resume')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      return res.sendStatus(SERVER_ERROR);
    });
});

module.exports = router;
