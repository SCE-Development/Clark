const express = require('express');
const axios = require('axios');
const router = express.Router();
const { LED_SIGN_URL } = require('../../config/config.js');
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const AWS = require('aws-sdk');
const { ledSqsKeys } = require('../../config/config.json');

creds = new AWS.Credentials(ledSqsKeys.CLIENT_ID, ledSqsKeys.CLIENT_SECRET);
AWS.config.update({
  region: 'us-west-1',
  endpoint: LED_SIGN_URL,
  credentials: creds
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });
const queueUrl =
'https://sqs.us-west-2.amazonaws.com/'
+ ledSqsKeys.ACCOUNT_ID + '/' + ledSqsKeys.QUEUE_NAME;

router.get('/healthCheck', (req, res) => {
  axios.get(LED_SIGN_URL + 'healthCheck')
    .then(response => {
      res.status(OK).send(response.data);
    })
    .catch(error => {
      res.status(BAD_REQUEST).send(error);
    });
});

router.post('/updateSignText', (req, res) => {
  const sqsParams = {
    MessageBody: JSON.stringify(
      req.body
    ),
    QueueUrl: queueUrl
  };
  sqs.sendMessage(sqsParams, function(err, data) {
  });
  res.sendStatus(OK);
});


module.exports = router;
