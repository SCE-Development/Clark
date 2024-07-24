const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const Advertisement = require('../models/Advertisement');

router.get('/getAllAdvertisements', (req, res) => {
  Advertisement.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST)
    })
});

router.post('/createAdvertisement', (req, res) => {
  const newAd = new Advertisement({
    saying: req.body.saying,
    expireDate: req.body.expireDate
  })

  Advertisement.create(newAdd)
    .then((post) => {
      return res.json(post)
    })
    .catch(
      (error) => res.sendStatus(BAD_REQUEST)
    )
})

outer.post('/deleteAdvertisement', (req, res) => {
  Animal.deleteOne({ _id: req.body._id })
    .then(result => {
      if (result.n < 1) {
        res.sendStatus(NOT_FOUND);
      } else {
        res.sendStatus(OK);
      }
    })
    .catch(() => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
