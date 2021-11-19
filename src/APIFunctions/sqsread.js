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
const params = {
  QueueUrl: queueUrl,
  MaxNumberOfMessages: 1,
  VisibilityTimeout: 0,
  WaitTimeSeconds: 0
};
setInterval(() => {
  
  sqs.receiveMessage(params, (err, data) => {
    
    if (err) {
      console.log(err, err.stack);
    } else {
      // console.log(data, "whaa");
      if (!data.Messages) {
        console.log('Nothing to process');
        return;
      }
      // console.log("I am going to parse", data.Messages[0].Body);
      const orderData = JSON.parse(data.Messages[0].Body);
      console.log('Order received', orderData);
      // orderData is now an object that contains order_id and date properties
      // Lookup order data from data storage
      // Execute billing for order
      // Update data storage
      // Now we must delete the message so we don't handle it again
      const deleteParams = {
        QueueUrl: queueUrl,
        ReceiptHandle: data.Messages[0].ReceiptHandle
      };
      sqs.deleteMessage(deleteParams, (err, data) => {
        if (err) {
          console.log(err, err.stack);
        } else {
          console.log('Successfully deleted message from queue');
        }
      });
    }
  });
}, 1000);
