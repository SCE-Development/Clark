const fs = require('fs');
const bodyParser = require('body-parser');

const express = require('express')
const app = express()
const port = 8000

const AWS = require('aws-sdk');

creds = new AWS.Credentials('AKIARDBH275VWR56E346', 'dsr/ji9NPTpfB4UgcXBx0engYrARZ+lksZmgP4FS');
AWS.config.update({
  region: "us-west-1",
  endpoint: "http://localhost:8000",
  credentials: creds
});

const sqs = new AWS.SQS({ apiVersion: '2012-11-05' });

const accountId = '075245485931';
const queueName = 'led-sign'
const queueUrl = `https://sqs.us-west-2.amazonaws.com/${accountId}/${queueName}`;

app.use(
  bodyParser.json({
    // support JSON-encoded request bodies
    limit: '50mb',
    strict: true,
  })
);
app.use(
  bodyParser.urlencoded({
    // support URL-encoded request bodies
    limit: '50mb',
    extended: true,
  })
);

app.post('/sendLEDSign', async (req, res) => {
  console.log(req.body)
  // const { text } = req.body;
  // console.log(text);
  const sqsParams = {
    MessageBody: JSON.stringify(
      req.body
    ),
    QueueUrl: queueUrl
  };
  sqs.sendMessage(sqsParams, function (err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else console.log(data);           // successful response
  })
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});