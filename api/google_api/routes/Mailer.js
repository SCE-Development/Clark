const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const { verification } = require('../email_templates/verification');
const {
  OK,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;
const { googleApiKeys } = require('../../config/config.json');
const { USER } = googleApiKeys;

router.post('/sendVerificationEmail', async (req, res) => {
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const apiHandler = new SceGoogleApiHandler(
    scopes, pathToToken);
  const tokenJson = await apiHandler.checkIfTokenFileExists();

  if (tokenJson) {
    if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
      apiHandler.refreshToken();
    }
  } else {
    apiHandler.getNewToken(false);
  }

  await verification(
    USER, req.body.recipientEmail, req.body.recipientName
  )
    .then((template) => {
      apiHandler.sendEmail(template)
        .then(_ => {
          res.sendStatus(OK);
        })
        .catch(_ => {
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch(_ => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
