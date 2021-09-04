const express = require('express');
const router = express.Router();
const { OK, NOT_FOUND } = require('../util/constants').STATUS_CODES;
const s3BucketKeys = require('../config/config.json').S3Bucket;
const { S3BucketApiHandler } = require('../util/S3BucketApiHandler');

router.post('/getSignedUrl', (req, res) => {
  const fileName = req.body.fileName;
  const fileType = req.body.fileType;
  const bucket = s3BucketKeys.BUCKET;

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
