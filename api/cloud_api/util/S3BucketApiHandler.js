const s3BucketKeys = require('../../config/config.json').S3Bucket;
const aws = require('aws-sdk');
const { resolve } = require('path');

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

  async getListOfFiles(s3Params) {
    aws.config.setPromisesDependency();
    const object = await this.s3.listObjectsV2(s3Params).promise();
    return object;
  }
}

module.exports = { S3BucketApiHandler };
