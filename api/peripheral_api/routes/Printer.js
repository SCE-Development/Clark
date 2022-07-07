const axios = require('axios');
const express = require('express');
const router = express.Router();
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;
const s3BucketKeys = require('../../config/config.json').S3Bucket;
const printingS3Bucket = require('../../config/config.json').PrintingS3Bucket;
const {
  ACCOUNT_ID,
  PAPER_PRINTING_QUEUE_NAME
} = require('../../config/config.json').Queue;
const {
  verifyToken,
  checkIfTokenSent
} = require('../../util/token-verification');

const AWS = require('aws-sdk');
let creds = new
AWS.Credentials(s3BucketKeys.AWSACCESSKEYID, s3BucketKeys.AWSSECRETKEY);
AWS.config.update({
  region: 'us-west-1',
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
    .get('http://localhost:14000/')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      return res.sendStatus(NOT_FOUND);
    });
});

const s3 = new AWS.S3({ apiVersion: '2012-11-05' });
router.post('/sendPrintRequest', async (req, res) => {
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

  const sqsParams = {
    MessageBody: JSON.stringify({
      location: response.Location,
      fileNo: fileName,
      copies: copies,
      pageRanges,
    }),
    QueueUrl: `https://sqs.us-west-2.amazonaws.com/${accountId}/${queueName}`
  };
  sqs.sendMessage(sqsParams, (err, data) => {
    return res.sendStatus(OK);
  });
});

module.exports = router;
