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
  const sqsHandler = new SceSqsApiHandler(Queue.PAPER_PRINTING_QUEUE_NAME);
  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!AWS_KEYS.ENABLED) {
    logger.warn('AWS is not enabled');
    return res.sendStatus(OK);
  }
  const { raw, copies, pageRanges } = req.body;
  const fileName = Math.random();

  const params = {
    Key: `folder/${fileName}.pdf`,
    Body: Buffer.from(raw, 'base64'),
    Bucket: printingS3Bucket,
  };

  const response = await s3.upload(params, function(err, data) {
    if (err) {
      logger.error('Unable to upload data: ', err);
      throw err;
    }
  }).promise();

  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

  const accountId = ACCOUNT_ID;
  const queueName = PAPER_PRINTING_QUEUE_NAME;
  const data = JSON.stringify({
    location: response.Location,
    fileNo: fileName,
    copies,
    pageRanges,
  });
  const result = sqsHandler.pushMessageToQueue(data);

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
