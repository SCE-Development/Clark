const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const AWS = require('aws-sdk');
const { ledSqsKeys, ledSignUrl } = require('../../config/config.json');

const creds = new AWS.Credentials(ledSqsKeys.CLIENT_ID,
  ledSqsKeys.CLIENT_SECRET);

AWS.config.update({
  region: 'us-west-1',
  endpoint: ledSignUrl,
  credentials: creds
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueUrl =
'https://sqs.us-west-2.amazonaws.com/'
+ ledSqsKeys.ACCOUNT_ID + '/' + ledSqsKeys.QUEUE_NAME;

router.get('/healthCheck', (req, res) => {
  res.sendStatus(OK);
});

router.post('/updateSignText', (req, res) => {
  const sqsParams = {
    MessageBody: JSON.stringify(
      req.body
    ),
    QueueUrl: queueUrl
  };
  sqs.sendMessage(sqsParams, function(err, data) {
    if(err) {
      res.sendStatus(BAD_REQUEST);
    } else {
      res.sendStatus(OK);
    }
  });
});


module.exports = router;
