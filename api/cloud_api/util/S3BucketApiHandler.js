const s3BucketKeys = require('../../config/config.json').S3Bucket;
const aws = require('aws-sdk');

class S3BucketApiHandler {
  constructor() {
    this.s3 = new aws.S3({
      accessKeyId: s3BucketKeys.AWSACCESSKEYID,
      secretAccessKey: s3BucketKeys.AWSSECRETKEY,
      region: 'us-west-1',
    });
  }
  getSignedUrl(s3Params, bucket) {
    return new Promise((resolve, reject) => {
      if(s3BucketKeys.AWSACCESSKEYID == 'NOT_SET'
      && s3BucketKeys.AWSSECRETKEY == 'NOT_SET') {
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
