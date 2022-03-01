const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;
const { RfidHelper } = require('../util/RFID-helpers');
const awsIot = require('aws-iot-device-sdk');
const { AWS_IOT_ENDPOINT } = require('../../config/config.json');

const rfidHelper = new RfidHelper();

if (rfidHelper.keysExist() && !rfidHelper.testing()) {
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
}

router.post('/createRFID', (req, res) => {
  if (rfidHelper.addingRfid()) {
    return res.sendStatus(BAD_REQUEST);
  }
  rfidHelper.startCountdownToAddCard(req.body.name);
  return res.sendStatus(OK);
});

router.get('/getRFIDs', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  RFID.find()
    .then((items) => res.status(OK).send(items))
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.post('/deleteRFID', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  RFID.deleteOne({ _id: req.body._id })
    .then((result) => {
      if (result.n < 1) {
        return res.sendStatus(NOT_FOUND);
      } else {
        return res.sendStatus(OK);
      }
    })
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
