const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST, FORBIDDEN, UNAUTHORIZED, NOT_FOUND } = require('../../util/constants').STATUS_CODES;
const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const logger = require('../../util/logger');
const Advertisement = require('../models/Advertisement');
const AuditLog = require('../models/AuditLog.js');
const AuditLogActions = require('../util/auditLogActions.js');

router.get('/', async (req, res) => {
  const count = await Advertisement.countDocuments();
  const random = Math.floor(Math.random() * count);

  Advertisement.findOne().skip(random)
    .then(items => {
      res.status(OK).send(items || {});
    })
    .catch(error => {
      logger.error('/api/Advertisement/ had an error', error);
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
    .sort({ createdAt: -1 })
    .then(items => res.status(OK).send(items))
    .catch(error => {
      logger.error('/api/Advertisement/getAllAdvertisements/ had an error', error);
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/createAdvertisement', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  }

  const user = await decodeToken(req);
  if (!user) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const newAd = new Advertisement({
    message: req.body.message,
    expireAt: req.body.expireDate
  });

  try {
    const createdAd = await Advertisement.create(newAd);
    AuditLog.create({
      userId: user._id,
      action: AuditLogActions.CREATE_AD,
      details: {
        message: createdAd.message,
        expireAt: createdAd.expireAt,
        advertisementId: createdAd._id
      }
    }).catch(logger.error);

    res.status(OK).send(createdAd);
  } catch (error) {
    logger.error('Error creating ad:', error);
    res.sendStatus(BAD_REQUEST);
  }
});

router.post('/deleteAdvertisement', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  const user = await decodeToken(req);
  if (!user) {
    return res.sendStatus(UNAUTHORIZED);
  }

  try {
    const deleteResult = await Advertisement.findOneAndDelete({ _id: req.body._id });

    if(!deleteResult) {
      return res.sendStatus(NOT_FOUND);
    }

    AuditLog.create({
      userId: user._id,
      action: AuditLogActions.DELETE_AD,
      details: {
        deletedAd: {
          id: deleteResult._id,
          message: deleteResult.message,
        }
      }
    }).catch(logger.error);

    res.sendStatus(OK);
  } catch (error) {
    logger.error('Error deleting ad:', error);
    res.sendStatus(BAD_REQUEST);
  }
});

module.exports = router;
