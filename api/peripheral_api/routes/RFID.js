const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;
const { RfidHelper } = require('../util/RFID-helpers');
const awsIot = require('aws-iot-device-sdk');
const { AWS_IOT_ENDPOINT } = require('../../config/config.json').AWS;
const {
  verifyToken,
  checkIfTokenSent
} = require('../../util/token-verification');
const rfidHelper = new RfidHelper();
const logger = require('../../util/logger');

if (rfidHelper.keysExist() && !rfidHelper.testing()) {
  try {
    const device = awsIot.device({
      keyPath: '../api/config/AWS-IOT/private.pem.key',
      certPath: '../api/config/AWS-IOT/cert.pem.crt',
      caPath: '../api/config/AWS-IOT/AmazonRootCA1.pem',
      clientId: 'CentauriServer',
      host: AWS_IOT_ENDPOINT
    });

    device
      .on('connect', function() {
        device.subscribe('MessageForNode');
      });

    device
      .on('message', async function(topic, payload) {
        rfidHelper.handleAwsIotMessage(device, payload);
      });
  } catch (e) {
    logger.error('Error connecting to AWS IoT: ', e);
  }
}

router.post('/createRFID', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('No token sent');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('Invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (rfidHelper.addingRfid()) {
    logger.warn('RFID is already being added');
    return res.sendStatus(BAD_REQUEST);
  }
  logger.info('Creating RFID...');
  rfidHelper.startCountdownToAddCard(req.body.name);
  return res.sendStatus(OK);
});

router.get('/getRFIDs', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('No token sent');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('Invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  RFID.find()
    .then((items) => res.status(OK).send(items))
    .catch((error) => {
      logger.error('Something went wrong with finding the RFID', error);
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/deleteRFID', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('No token sent');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('Invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  RFID.deleteOne({ _id: req.body._id })
    .then((result) => {
      if (result.n < 1) {
        logger.warn('RFID not found');
        return res.sendStatus(NOT_FOUND);
      } else {
        logger.info('RFID deleted');
        return res.sendStatus(OK);
      }
    })
    .catch((error) => {
      logger.error('Something went wrong with deleting the RFID: ', error);
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
