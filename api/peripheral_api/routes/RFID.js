const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN } =
  require('../../util/constants').STATUS_CODES;
const { validate, createRfid } = require('../util/RFID-helpers');
const awsIot = require('aws-iot-device-sdk');
const { AWS_IOT_ENDPOINT } = require('../../config/config.json');

const device = awsIot.device({
  keyPath: '../api/config/AWS-IOT/private.pem.key',
  certPath: '../api/config/AWS-IOT/cert.pem.crt',
  caPath: '../api/config/AWS-IOT/AmazonRootCA1.pem',
  clientId: 'CentauriServer',
  host: AWS_IOT_ENDPOINT
});

let addRfid = false;
let name = null;

device
  .on('connect', function() {
    /* eslint-disable-next-line */
    console.log('Connected to AWS IoT!');
    device.subscribe('MessageForNode');
  });

device
  .on('message', async function(topic, payload) {
    if (addRfid) {
      const creatorResponse = await createRfid(name, payload);
      device.publish('MessageForESP32', JSON.stringify({
        message: creatorResponse
      }));
      name = null;
      addRfid = false;
      clearTimeout();
    } else {
      const validateResponse = await validate(payload);
      device.publish('MessageForESP32', JSON.stringify({
        message: validateResponse
      }));
    }
  });

router.post('/createRFID', (req, res) => {
  if (addRfid) {
    return res.sendStatus(BAD_REQUEST);
  }
  addRfid = true;
  name = req.body.name;
  setTimeout(() => {
    addRfid = false;
    name = null;
  }, 60000);
  return res.sendStatus(OK);
});

// -------------------------------------------
// stays same even after adding pub sub since
// we are not interacting with esp32
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
        return res.sendStatus(BAD_REQUEST);
      } else {
        return res.sendStatus(OK);
      }
    })
    .catch((error) => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
