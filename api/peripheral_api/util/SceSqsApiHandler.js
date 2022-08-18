const AWS_KEYS = require('../../config/config.json').AWS;
const AWS = require('aws-sdk');
const logger = require('../../util/logger');
/**
 * SQS API Handler
 * @member {Object} sqs  SQS service object
 * @member {String} queueName name of the queue
 * @member {String} queueUrl url of the queue
 */
class SceSqsApiHandler {
  constructor(queueName) {
    const creds = new AWS.Credentials(AWS_KEYS.ACCESS_KEY_ID,
      AWS_KEYS.SECRET_ACCESS_KEY);
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
      + AWS_KEYS.ACCOUNT_ID + '/' + this.queueName;
  }
  /**
   * Push a message to the queue with the body being the
   * data parameter.
   * @param {Object} data The data we wish to push to the queue
   * @returns {Promise<boolean|Object>} the response from SQS
   */
  pushMessageToQueue(data) {
    return new Promise((resolve, reject) => {
      if (!AWS_KEYS.ENABLED) {
        return resolve(true);
      }
      const sqsParams = {
        MessageBody: JSON.stringify(data),
        QueueUrl: this.queueUrl
      };
      this.sqs.sendMessage(sqsParams, function(err, data) {
        if (err) {
          logger.error('Error pushing message to queue: ', err);
          resolve(false);
        } else {
          resolve(data);
        }
      });
    });
  }
}

module.exports = { SceSqsApiHandler };
