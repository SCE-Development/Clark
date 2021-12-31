const express = require('express');
const fs = require('fs');
const router = express.Router();
const {OK} = require('../../util/constants').STATUS_CODES;
const app = express();
const s3BucketKeys = require('../../config/config.json').S3Bucket;
const printingS3Bucket = require('../../config/config.json').PrintingS3Bucket;
const queueKeys = require('../../config/config.json').Queue;

const AWS = require('aws-sdk');
let creds = new
AWS.Credentials(s3BucketKeys.AWSACCESSKEYID, s3BucketKeys.AWSSECRETKEY);
AWS.config.update({
  region: 'us-west-1',
  endpoint: 'https://s3.amazonaws.com',
  credentials: creds
});

router.get('/healthCheck', (req, res) => {
  res.sendStatus(OK);
});

const s3 = new AWS.S3({ apiVersion: '2012-11-05' });
router.post('/sendPrintRequest', async (req, res) => {
  /* eslint-disable-next-line */
  if (s3BucketKeys.AWSACCESSKEYID == 'NOT_SET'&& s3BucketKeys.AWSSECRETKEY == 'NOT_SET') {
    return res.sendStatus(OK);
  }
  const { raw } = req.body;
  const { copies } = req.body;
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

  const accountId = queueKeys.AccountID;
  const queueName = queueKeys.QueueName;

  const sqsParams = {
    MessageBody: JSON.stringify({
      location: response.Location,
      fileNo: fileName,
      copies: copies,
    }),
    QueueUrl: `https://sqs.us-west-2.amazonaws.com/${accountId}/${queueName}`
  };
  sqs.sendMessage(sqsParams, (err, data) => {
    return res.sendStatus(OK);
  });
});

module.exports = router;
