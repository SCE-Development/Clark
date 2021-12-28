const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const { verification } = require('../email_templates/verification');
const { blastEmail } = require('../email_templates/blastEmail');
const {
  OK,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;
const { googleApiKeys } = require('../../config/config.json');
const { USER } = googleApiKeys;

/**
 * Check if API keys are valid
 */
// Routing post /sendVerificationEmail calls the sendEmail function
// and sends the verification email with the verification email template
router.post('/sendVerificationEmail', async (req, res) => {
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  const tokenJson = await apiHandler.checkIfTokenFileExists();

  if (tokenJson) {
    if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
      apiHandler.refreshToken();
    }
  } else {
    apiHandler.getNewToken();
  }

  await verification(USER, req.body.recipientEmail, req.body.recipientName)
    .then((template) => {
      apiHandler
        .sendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
        });
    })
    .catch((_) => {
      res.sendStatus(BAD_REQUEST);
    });
});

// Routing post /sendBlastEmail calls the sendEmail function
// and sends the blast email with the blast email template
router.post('/sendBlastEmail', async (req, res) => {
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);

  await blastEmail(
    USER,
    req.body.emailList,
    req.body.subject,
    req.body.content
  )
    .then((template) => {
      apiHandler
        .sendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
        }).catch((_) => {
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch((_) => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
