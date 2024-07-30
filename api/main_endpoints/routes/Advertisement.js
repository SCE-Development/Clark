const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED, NOT_FOUND } = require('../../util/constants').STATUS_CODES;
const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const Advertisement = require('../models/Advertisement');

router.get('/', async (req, res) => {
  Advertisement.find()
    .then(items => {
      const randomIndex = Math.floor(Math.random() * items.length);
      res.status(OK).send(items[randomIndex]);
    })
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.get('/getAllAdvertisements', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Advertisement.find()
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/createAdvertisement', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newAd = new Advertisement({
    message: req.body.message,
    expireDate: req.body.expireDate
  });

  Advertisement.create(newAd)
    .then((post) => {
      return res.json(post);
    })
    .catch(
      (error) => res.sendStatus(BAD_REQUEST)
    );
});

router.post('/deleteAdvertisement', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Advertisement.deleteOne({ _id: req.body._id })
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
