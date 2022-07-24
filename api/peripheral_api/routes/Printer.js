const axios = require('axios');
const express = require('express');
const { SceSqsApiHandler } = require('../util/SceSqsApiHandler');
const AWS = require('aws-sdk');

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
const { s3BucketKeys, printingS3Bucket }
  = require('../../config/config.json');
const {
  CLIENT_ID,
  CLIENT_SECRET,
  ACCOUNT_ID,
  PAPER_PRINTING_QUEUE_NAME,
} = require('../../config/config.json').Queue;

const router = express.Router();

let creds = new
AWS.Credentials(CLIENT_ID, CLIENT_SECRET);
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
      return res.sendStatus(NOT_FOUND);
    });
});

const s3 = new AWS.S3({ apiVersion: '2012-11-05' });
router.post('/sendPrintRequest', async (req, res) => {
  const sqsHandler = new SceSqsApiHandler(PAPER_PRINTING_QUEUE_NAME);
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (s3BucketKeys.AWSACCESSKEYID === 'NOT_SET'
    && s3BucketKeys.AWSSECRETKEY === 'NOT_SET') {
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
    if (err) throw err;
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
  const sqsHandler = new SceSqsApiHandler(PAPER_PRINTING_QUEUE_NAME);
  const { apiKey, fileURL } = req.body;
  if (!checkDiscordKey(apiKey)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const result = await sqsHandler.pushMessageToQueue({ fileURL });

  if (!result) {
    return res.sendStatus(BAD_REQUEST);
  }
  return res.sendStatus(OK);
});

module.exports = router;
