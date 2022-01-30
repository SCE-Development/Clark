const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } =
  require('../../util/constants').STATUS_CODES;
const { onMessage } = require('../util/RFID-helpers');
const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: '../api/config/AWS-IOT/private.pem.key',
  certPath: '../api/config/AWS-IOT/cert.pem.crt',
  caPath: '../api/config/AWS-IOT/AmazonRootCA1.pem',
  clientId: 'CentauriServer',
  host: 'ae3c662b19597-ats.iot.us-west-1.amazonaws.com'
});

let addRfid = false;
let newName = null;

device
  .on('connect', function () {
    /* eslint-disable-next-line */
    console.log('Connected to AWS IoT!');
    device.subscribe('MessageForNode');
  });

device
  .on('message', async function (topic, payload) {
    onMessage(addRfid, newName, payload);
  });

router.post('/createRFID', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (addRfid) {
    return res.sendStatus(BAD_REQUEST);
  }
  addRfid = true;
  newName = req.body.name;
  setTimeout(() => {
    addRfid = false;
    newName = null;
  }, 60000);
  return res.sendStatus(OK);
});

// -------------------------------------------
// stays same even after adding pub sub since
// we are not interacting with esp32
router.get('/getRFIDs', (req, res) => {
  RFID.find()
    .then((items) => res.status(OK).send(items))
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.delete('/deleteRFID', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  RFID.deleteOne({ _id: req.body._id })
    .then((result) => {
      if (result.n < 1) {
        return res.sendStatus(BAD_REQUEST);
      } else {
        return res.sendStatus(OK);
      }
    })
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = { router, device };
