const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED, NOT_FOUND } = require('../../util/constants').STATUS_CODES;
const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const Advertisement = require('../models/Advertisement');

router.get('/', async (req, res) => {
  const count = await Advertisement.countDocuments();
  const random = Math.floor(Math.random() * count);

  Advertisement.findOne().skip(random)
    .then(items => {
      res.status(OK).send(items || {});
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
  const now = new Date();
  // const expireInOneMinute = new Date(now.getTime() + 60 * 1000);
  console.log("expire date in delete " + expireDate);

  const newAd = new Advertisement({
    // message: req.body.message,
    // expireDate: expireInOneMinute, // testing and it doesn't work
    // expireAt: expireInOneMinute
    message: req.body.message,
    expireDate: req.body.expireDate,
    expireAt: req.body.expireDate

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
  console.log("expire date in delete " + expireDate);

  Advertisement.deleteOne({ _id: req.body._id })
    .then(result => {
      if (result.deletedCount < 1) { // used to be result.n
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
