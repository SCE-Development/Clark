const axios = require('axios');
const express = require('express');
const { SceSqsApiHandler } = require('../util/SceSqsApiHandler');
const AWS = require('aws-sdk');
const logger = require('../../util/logger');
const {
  verifyToken,
  checkIfTokenSent,
  checkDiscordKey
} = require('../../util/token-verification');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

const AWS_KEYS = require('../../config/config.json').AWS;
const {Queue, S3Bucket} = AWS_KEYS;

const router = express.Router();

let creds = new
AWS.Credentials(AWS_KEYS.ACCESS_KEY_ID, AWS_KEYS.SECRET_ACCESS_KEY);
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'https://s3.amazonaws.com',
  credentials: creds
});

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

const s3 = new AWS.S3({ apiVersion: '2012-11-05' });
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
        logger.warn("hello there", {
          raw: typeof raw,
          rawLength: raw.length,
          copies,
          pageRanges,
        })
        res.sendStatus(OK);
      }).catch((err) => {
        logger.error('had an error: ', err);
        res.sendStatus(500);
      });

  if (!result) {
    return res.sendStatus(BAD_REQUEST);
  }
  return res.sendStatus(OK);
});

router.post('/pushDiscordPDFToSqs', async (req, res) => {
  const sqsHandler = new SceSqsApiHandler(Queue.PAPER_PRINTING_QUEUE_NAME);
  const { apiKey, fileURL } = req.body;
  if (!checkDiscordKey(apiKey)) {
    logger.warn('/pushDiscordPDFToSqs was requested with an invalid key');
    return res.sendStatus(UNAUTHORIZED);
  }

  const result = await sqsHandler.pushMessageToQueue({ fileURL });

  if (!result) {
    return res.sendStatus(BAD_REQUEST);
  }
  return res.sendStatus(OK);
});

module.exports = router;
