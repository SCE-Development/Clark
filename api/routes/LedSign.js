const express = require('express');
const router = express.Router();
const {
  healthCheck,
  updateSignText
} = require('../printingRPC/client/ledsign/led_sign_client');
const { OK, NOT_FOUND, BAD_REQUEST } = require('../constants').STATUS_CODES;
const { ledSignIp } = require('../config/config');
const SignLog = require('../models/SignLog');

async function saveSignLog(req) {
  let saveSuccessful = true;
  const newSign = new SignLog({
    signTitle: req.body.text,
    firstName: req.body.firstName,
    email: req.body.email
  });

  await newSign.save()
    .catch(_ => {
      saveSuccessful = false;
    });
  return saveSuccessful;
}

router.post('/updateSignText', async (req, res) => {
  if (!await saveSignLog(req)) {
    return res.sendStatus(BAD_REQUEST);
  }
  await updateSignText(req.body, ledSignIp)
    .then(response => {
      return res.status(OK).send({ ...response });
    })
    .catch(err => {
      return res.status(BAD_REQUEST).send({ ...err });
    });
});

router.post('/healthCheck', async (req, res) => {
  const { officerName } = req.body;
  await healthCheck(officerName, ledSignIp)
    .then(response => {
      const { message } = response;
      return res.status(OK).send({ 
        text: message.getText(),
        brightness: message.getBrightness(),
        scrollSpeed: message.getScrollSpeed(),
        backgroundColor: message.getBackgroundColor(),
        textColor: message.getTextColor(),
        borderColor: message.getBorderColor()
      });
    })
    .catch(err => {
      return res.status(NOT_FOUND).send({ ...err });
    });
});

router.get('/getSignLogs', (req, res) => {
  SignLog.find()
    .sort({ timeOfPosting: -1 })
    .then(signLogs => res.status(OK).send(signLogs));
});

module.exports = router;
