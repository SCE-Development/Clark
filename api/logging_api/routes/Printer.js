const express = require('express')
const fs = require('fs');
const router = express.Router();
const {OK} = require('../../util/constants').STATUS_CODES;
const app = express()
const s3BucketKeys = require('../../config/config.json').S3Bucket;
const printingS3Bucket = require('../../config/config.json').PrintingS3Bucket;
const queueKeys = require('../../config/config.json').Queue;

// Load the AWS SDK for Node.js
const AWS = require('aws-sdk');
// Set the region we will be using
var creds = new AWS.Credentials(s3BucketKeys.AWSACCESSKEYID, s3BucketKeys.AWSSECRETKEY);

AWS.config.update({
  region: "us-west-1",
  endpoint: "https://s3.amazonaws.com",
  credentials: creds
});

router.get('/healthCheck', (req, res) => {
  // console.log(`Hello ${req.query.name}!`);
  res.sendStatus(OK);
});
app.use(express.json());

/*
have this file encode the base and then upload it to s3
*/
const s3 = new AWS.S3({ apiVersion: '2012-11-05' });
router.post('/sendPrintRequest', async (req, res) => {

  // console.log(req.body);
  const { raw } = req.body;
  const { copies } = req.body;
  const allen = Math.random()
  // console.log(copies);
  // console.log(raw.length, Buffer.from(file, 'base64'));
  const params = {
    Key: `folder/${allen}.pdf`,
    Body: Buffer.from(raw, 'base64'), // <---------
    Bucket: printingS3Bucket,
    // ContentType: 'application/pdf'
  };
  // console.log(s3);

  const response = await s3.upload(params, function (err, data) {
    if (err) {
      throw err;
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  }).promise();

//   console.log(response.Location);
  const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

  const accountId = queueKeys.AccountID;
  const queueName = queueKeys.QueueName;
  // Setup the sendMessage parameter object
  const sqsParams = {
    MessageBody: JSON.stringify({
      location: response.Location,
      fileNo: allen,
      copies: copies,
    }),
    QueueUrl: `https://sqs.us-west-2.amazonaws.com/${accountId}/${queueName}`
  };
  sqs.sendMessage(sqsParams, (err, data) => {
    if (err) {
      console.log("Error", err);
    } else {
      console.log("Successfully added message", data.MessageId);
    }
  });
  res.sendStatus(OK);
});

module.exports = router;
