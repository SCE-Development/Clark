const express = require('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;
const {S3Bucket} = require('../../config/config.json').AWS;
const { S3BucketApiHandler } = require('../util/S3BucketApiHandler');

router.post('/getSignedUrl', (req, res) => {
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  const bucket = S3Bucket.NAME;

  const s3Params = {
    Bucket: bucket,
    Key: fileName,
    Expires: 500,
    ContentType: fileType,
    ACL: 'public-read',
  };

  const s3Handler = new S3BucketApiHandler();

  s3Handler
    .getSignedUrl(s3Params, bucket)
    .then((url) => {
      res.status(OK).send({ url });
    })
    .catch((_) => {
      res.sendStatus(NOT_FOUND);
    });
});

module.exports = router;
