const express = require('express');
const router = express.Router();
const {
  OK,
  UNAUTHORIZED,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;
const s3BucketKeys = require('../../config/config.json').S3Bucket;
const printingS3Bucket = require('../../config/config.json').PrintingS3Bucket;
const {
  CLIENT_ID,
  CLIENT_SECRET,
  ACCOUNT_ID,
  PAPER_PRINTING_QUEUE_NAME,
} = require('../../config/config.json').Queue;
const {
  verifyToken,
  checkIfTokenSent
} = require('../../util/token-verification');

const AWS = require('aws-sdk');

let creds = new
AWS.Credentials(CLIENT_ID, CLIENT_SECRET);
AWS.config.update({
  region: 'us-west-2',
  endpoint: 'https://s3.amazonaws.com',
  credentials: creds
});

router.get('/healthCheck', (req, res) => {
  res.sendStatus(OK);
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

router.post('/addFilePDF', async (req, res) => {
  // if (!checkIfTokenSent(req)) {
  //   return res.sendStatus(UNAUTHORIZED);
  // }
  // if (!await verifyToken(req.body.token)) {
  //   return res.sendStatus(UNAUTHORIZED);
  // }
  // if (s3BucketKeys.AWSACCESSKEYID === 'NOT_SET'
  // && s3BucketKeys.AWSSECRETKEY === 'NOT_SET') {
  //   return res.sendStatus(OK);
  // }
  // const { url } = req.body;
  // const fileName = Math.random();
  // const params = {
  //   Key: `folder/${fileName}.pdf`,
  //   Body: Buffer.from(url, 'base64'),
  //   Bucket: printingS3Bucket,
  // }

  // const response  = await s3.upload(params, function( err, data) {
  //   if(err) throw err;
  // }).promise();

  const sqs = new AWS.SQS({apiVersion: '2012-11-05'});

  const accountId = ACCOUNT_ID;
  const queueName = PAPER_PRINTING_QUEUE_NAME;

  const sqsParams = {
    MessageBody: JSON.stringify({
      'fileURL': req.body.url
    }),
    QueueUrl: `https://sqs.us-west-2.amazonaws.com/${accountId}/${queueName}`
  };

  sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      return res.sendStatus(BAD_REQUEST);
    } else {
      return res.sendStatus(OK);
    }
  });
});

router.get('/getURL', (req, res) => {
  PrinterHawkTest.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
