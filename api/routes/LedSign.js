const express = require('express');
const router = express.Router();
const {
  healthCheck,
  updateSignText
} = require('../printingRPC/client/ledsign/led_sign_client');
const { OK, NOT_FOUND, BAD_REQUEST } = require('../constants').STATUS_CODES;
const { addSignLog } = require('../util/logging-helpers');
const { ledSignIp } = require('../config/config');

router.post('/updateSignText', async (req, res) => {
  if (!await addSignLog(req.body)) {
    return res.sendStatus(BAD_REQUEST);
  }
  await updateSignText(req.body, ledSignIp)
    .then(response => {
      return res.status(OK).send({ ...response });
    })
    .catch(error => {
      return res.status(BAD_REQUEST).send({ ...error });
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
    .catch(error => {
      return res.status(NOT_FOUND).send({ ...error });
    });
});

module.exports = router;
