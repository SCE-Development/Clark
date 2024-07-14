const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const { verification } = require('../email_templates/verification');
const { passwordReset } = require('../email_templates/passwordReset');
const { blastEmail } = require('../email_templates/blastEmail');
const { unsubscribeEmail } = require('../email_templates/unsubscribeEmail');
const {
  OK,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');
const { googleApiKeys } = require('../../config/config.json');
const { USER, ENABLED } = googleApiKeys;

// Routing post /sendVerificationEmail calls the sendEmail function
// and sends the verification email with the verification email template
router.post('/sendVerificationEmail', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  }
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  const tokenJson = await apiHandler.checkIfTokenFileExists();

  if (tokenJson) {
    if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
      logger.warn('refreshing token');
      apiHandler.refreshToken();
    }
  } else {
    logger.warn('getting new token! ', { tokenJson });
    apiHandler.getNewToken();
  }


  await verification(USER, req.body.recipientEmail, req.body.recipientName)
    .then((template) => {
      apiHandler
        .sendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
        })
        .catch((err) => {
          logger.error('unable to send verification email:', err);
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch((err) => {
      logger.error('unable to generate verification template:', err);
      res.sendStatus(BAD_REQUEST);
    });
});

// Routing post /sendPasswordReset calls the sendEmail function
// and sends the email with the password reset template
router.post('/sendPasswordReset', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  }
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  const tokenJson = await apiHandler.checkIfTokenFileExists();

  if (tokenJson) {
    if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
      logger.warn('refreshing token');
      apiHandler.refreshToken();
    }
  } else {
    logger.warn('getting new token! ', { tokenJson });
    apiHandler.getNewToken();
  }

  await passwordReset(USER, req.body.resetToken, req.body.recipientEmail)
    .then((template) => {
      apiHandler
        .sendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
        })
        .catch((err) => {
          logger.error('unable to send password reset email:', err);
          res.sendStatus(BAD_REQUEST);
        });
    })
    .catch((err) => {
      logger.error('unable to generate password reset template:', err);
      res.sendStatus(BAD_REQUEST);
    });
});

// Routing post /sendUnsubscribeEmail calls the unsubscribeEmail function
// and sends the unsubscribe email with the unsubscribe email template
router.post('/sendUnsubscribeEmail', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  } else if (!req.body.users || !req.body.users.length) {
    return res.sendStatus(BAD_REQUEST);
  }


  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  for (let i = 0; i < req.body.users.length; i++) {
    (function(i) {
      setTimeout(async function() {
        const user = req.body.users[i];
        try {
          let fullName = user.firstName + ' ' + user.lastName;
          await unsubscribeEmail(USER, user.email, fullName)
            .then((template) => {
              apiHandler.sendEmail(template);
            });
        } catch (error) {
          logger.error('unable to send unsubscribe email:', error);
        }
      }, 2000 * (i));
    })(i);
  }
  return res.sendStatus(OK);
});


// Routing post /sendBlastEmail calls the sendEmail function
// and sends the blast email with the blast email template
router.post('/sendBlastEmail', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  }
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
