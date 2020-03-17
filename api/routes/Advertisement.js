const express = require('express');
const router = express.Router();
const Advertisement = require('../models/Advertisement');
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../constants').STATUS_CODES;

router.post('/addAdvertisement', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
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

router.get('/getAdvertisement', (req, res) => {
  Advertisement.find()
    .sort({ createDate: -1 })
    .then(advertisement => res.status(OK).send(advertisement));
});

router.post('/editAdvertisement', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const {
    createDate,
    expireDate,
    pictureUrl
  } = req.body;
  Advertisement.findOne({ _id: req.body.id })
    .then(advertisement => {
      advertisement.createDate = createDate || advertisement.createDate;
      advertisement.expireDate = expireDate || advertisement.expireDate;
      advertisement.pictureUrl = pictureUrl || advertisement.pictureUrl;
      advertisement
        .save()
        .then(result => {
          res.status(OK).json({ result,
            advertisement: 'advertisement updated successfully' });
        })
        .catch(err => {
          res.status(BAD_REQUEST).send({
            err,
            message: 'advertisement was not updated'
          });
        });
    })
    .catch(err => {
      res.status(NOT_FOUND).send({ err, message: 'advertisement not found' });
    });
});

router.post('/deleteAdvertisement', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Advertisement.deleteOne({ _id: req.body.id })
    .then(advertisement => {
      res.status(OK).json({ advertisement:
        'advertisement successfully deleted' });
    })
    .catch(err => {
      res.status(BAD_REQUEST).send({ err,
        message: 'deleting advertisement failed' });
    });
});

module.exports = router;
