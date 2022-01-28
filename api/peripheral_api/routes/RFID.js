const { hashedByte } = require('../util/RFID-helpers');
const express = require('express');
const router = express.Router();
const RFID = require('../models/RFID');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../../util/token-functions');
const { OK, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND } =
  require('../../util/constants').STATUS_CODES;

const awsIot = require('aws-iot-device-sdk');

const device = awsIot.device({
  keyPath: '../api/config/AWS-IOT/private.pem.key',
  certPath: '../api/config/AWS-IOT/cert.pem.crt',
  caPath: '../api/config/AWS-IOT/AmazonRootCA1.pem',
  clientId: 'CentauriServer',
  host: 'ae3c662b19597-ats.iot.us-west-1.amazonaws.com'
});

let add_RFID = false;
let new_name = null;

device
  .on('connect', function () {
    console.log('Connected to AWS IoT!');
    device.subscribe('MessageForNode');
  });

device
  .on('message', async function (topic, payload) {
    if (add_RFID) {
      const newRFID = new RFID({
        name: new_name,
        byte: await hashedByte(JSON.parse(payload.toString()).message)
      });
      RFID.create(newRFID, (error) => {
        if (error) {
          device.publish('MessageForESP32',
            JSON.stringify({
              message: BAD_REQUEST
            }));
        } else {
          device.publish('MessageForESP32',
            JSON.stringify({
              message: OK
            }));
        }
        new_name = null;
        add_RFID = false;
        clearTimeout();
      });
    } else {
      const {
        message
      } = JSON.parse(payload.toString());
      const hash = await hashedByte(message);
      RFID.findOne(
        {
          byte: hash
        })
        .then((result) => {
          if (result != null) {
            device.publish('MessageForESP32', JSON.stringify({ message: OK }));
          } else {
            device.publish('MessageForESP32', JSON.stringify({ message: NOT_FOUND }));
          }
        })
        .catch(() => {
          device.publish('MessageForESP32', JSON.stringify({ message: BAD_REQUEST }));
        });
    }
  });

router.post('/createRFID', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  if (add_RFID) {
    return res.sendStatus(BAD_REQUEST);
  }
  add_RFID = true;
  new_name = req.body.name;
  setTimeout(() => {
    add_RFID = false;
    new_name = null;
  }, 60000);
  return res.sendStatus(OK);
});

//-------------------------------------------
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

module.exports = router;