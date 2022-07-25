const AWS_KEYS = require('../../config/config.json').AWS;
const aws = require('aws-sdk');

class S3BucketApiHandler {
  constructor() {
    this.s3 = new aws.S3({
      accessKeyId: AWS_KEYS.ACCESS_KEY_ID,
      secretAccessKey: AWS_KEYS.SECRET_ACCESS_KEY,
      region: 'us-west-1',
    });
  }
  getSignedUrl(s3Params, bucket) {
    return new Promise((resolve, reject) => {
      if(!AWS_KEYS.ENABLED) {
        return resolve(true);
      }
      this.s3.getSignedUrl('putObject', s3Params, (err, data) => {
        if (err) {
          reject(false);
        }

        const returnData = {
          signedRequest: data,
          url: `https://${bucket}.s3.amazonaws.com/${s3Params.Key}`,
        };
        resolve(returnData);
      });
    });
  }
}

module.exports = { S3BucketApiHandler };
