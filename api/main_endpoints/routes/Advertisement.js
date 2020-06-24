const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const Advertisement = require('../models/Advertisement');

router.post('/addAdvertisement', (req, res) => {
  const newAd = new Advertisement({
    pictureUrl: req.body.pictureUrl,
    createDate: req.body.createDate,
    expireDate: req.body.expireDate
  });

  newAd.save(function(error) {
    if (error) {
      res.sendStatus(BAD_REQUEST);
    } else {
      res.sendStatus(OK);
    }
  });
});

router.get('/getAdvertisements', (req, res) => {
  Advertisement.find()
    .sort({ createDate: -1 })
    .then(advertisement => res.status(OK).send(advertisement));
});

module.exports = router;
