const queueKeys = require('../../config/config.json').Queue;
const AWS = require('aws-sdk');

/**
 * SQS API Handler 
 * @member {Object} sqs  SQS service object
 * @member {String} queueName name of the queue
 * @member {String} queueUrl url of the queue
 */
class SceSqsApiHandler {
  constructor(queueName) {
    const creds = new AWS.Credentials(queueKeys.CLIENT_ID,
      queueKeys.CLIENT_SECRET);
    AWS.config.update({
      region: 'us-west-2',
      credentials: creds
    });
    this.sqs = new AWS.SQS({
      apiVersion: '2012-11-05'
    });
    this.queueName = queueName;
    this.queueUrl =
      'https://sqs.us-west-2.amazonaws.com/'
      + queueKeys.ACCOUNT_ID + '/' + this.queueName;
  }
  /**
   * Push a message to the queue with the body being the
   * data parameter.
   * @param {Object} data The data we wish to push to the queue
   * @returns {Promise<boolean|Object>} the response from SQS
   */
  pushMessageToQueue(data) {
    return new Promise((resolve, reject) => {
      if (queueKeys.ACCOUNT_ID === 'NOT_SET'
        || this.queueName === 'NOT_SET') {
        return resolve(true);
      }
      const sqsParams = {
        MessageBody: JSON.stringify(data),
        QueueUrl: this.queueUrl
      };
      this.sqs.sendMessage(sqsParams, function (err, data) {
        if (err) {
          resolve(false);
        } else {
          resolve(data);
        }
      });
    });
  }
}

module.exports = { SceSqsApiHandler };
