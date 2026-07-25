const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const { verification } = require('../email_templates/verification');
const { passwordReset } = require('../email_templates/passwordReset');
const { unsubscribeEmail } = require('../email_templates/unsubscribeEmail');
const { membershipConfirmationCode } = require('../email_templates/membershipConfirmationCode');
const {
  OK,
  BAD_REQUEST,
  SERVER_ERROR
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');
const { googleApiKeys } = require('../../config/config.json');
const { USER, ENABLED } = googleApiKeys;
const { MetricsHandler } = require('../../util/metrics');
const generateHashedId = require('../util/auth').generateHashedId;

const scopes = ['https://mail.google.com/'];
const pathToToken = __dirname + '/../../config/token.json';

async function maybeRefreshTokenFromGcp() {
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  const tokenJson = await apiHandler.checkIfTokenFileExists();

  if (tokenJson) {
    if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
      // the time() function in prometheus returns the epoch time in seconds
      // i.e. 1760310047.552
      // Date.now() returns the time in milliseconds, so we divide by 1000
      // to be consistent with prometheus.
      MetricsHandler.gcpRefreshTokenLastUpdated.set(Math.floor(Date.now() / 1000));
      apiHandler.refreshToken();
    }
  } else {
    logger.warn('getting new token! ', { tokenJson });
    apiHandler.getNewToken();
  }
}

// Routing post /sendVerificationEmail calls the sendEmail function
// and sends the verification email with the verification email template
router.post('/sendVerificationEmail', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  }

  await maybeRefreshTokenFromGcp();

  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);

  let template = '';
  try {
    const hashedId = await generateHashedId(req.body.recipientEmail);
    template = verification(hashedId, USER, req.body.recipientEmail, req.body.recipientName);
  } catch(e) {
    logger.error('unable to generate verification template:', err);
    return res.sendStatus(BAD_REQUEST);
  }

  try {
    await apiHandler.sendEmail(template);
    MetricsHandler.emailSent.inc({ type: 'verification' });
    return res.sendStatus(OK);
  } catch(e) {
    logger.error('unable to send verification email:', e);
    res.sendStatus(BAD_REQUEST);
  }
});

// Routing post /sendPasswordReset calls the sendEmail function
// and sends the email with the password reset template
router.post('/sendPasswordReset', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  }

  await maybeRefreshTokenFromGcp();

  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);

  let template = '';
  try {
    const hashedId = await generateHashedId(req.body.recipientEmail);
    template = passwordReset(hashedId, USER, req.body.resetToken, req.body.recipientEmail);
  } catch(err) {
    logger.error('unable to send password reset email:', err);
    return res.sendStatus(BAD_REQUEST);
  }
  try {
    await apiHandler.sendEmail(template);
    MetricsHandler.emailSent.inc({ type: 'verification' });
    return res.sendStatus(OK);
  } catch(err) {
    logger.error('unable to generate password reset template:', err);
    res.sendStatus(BAD_REQUEST);
  }
});

// Routing post /sendUnsubscribeEmail calls the unsubscribeEmail function
// and sends the unsubscribe email with the unsubscribe email template
router.post('/sendUnsubscribeEmail', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  } else if (!req.body.users || !req.body.users.length) {
    return res.sendStatus(BAD_REQUEST);
  }

  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  for (let i = 0; i < req.body.users.length; i++) {
    (function(i) {
      setTimeout(async function() {
        const user = req.body.users[i];
        try {
          let fullName = user.firstName + ' ' + user.lastName;
          await unsubscribeEmail(USER, user.email, fullName)
            .then((template) => {
              apiHandler.sendEmail(template).then((_) => {
                MetricsHandler.emailSent.inc({ type: 'unsubscribe' });
              });
            });
        } catch (error) {
          logger.error('unable to send unsubscribe email:', error);
        }
      }, 2000 * (i));
    })(i);
  }
  return res.sendStatus(OK);
});

router.post('/sendMembershipConfirmationCode', async (req, res) => {
  if (!ENABLED && process.env.NODE_ENV !== 'test') {
    return res.sendStatus(OK);
  }

  await maybeRefreshTokenFromGcp();

  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);

  const { recipientEmail, confirmationCode } = req.body;

  if (!recipientEmail || !confirmationCode) {
    logger.warn('Missing recipientEmail or confirmationCode', { body: req.body });
    return res.status(BAD_REQUEST).json({
      error: 'recipientEmail and confirmationCode are required',
    });
  }

  await membershipConfirmationCode(USER, recipientEmail, confirmationCode)
    .then((template) => {
      apiHandler
        .sendEmail(template)
        .then((_) => {
          res.sendStatus(OK);
          MetricsHandler.emailSent.inc({ type: 'membershipConfirmationCode' });
        })
        .catch((err) => {
          logger.error('unable to send confirmation code: ', err);
          res.sendStatus(SERVER_ERROR);
        });
    })
    .catch((err) => {
      logger.error('unable to generate member confirmation email template: ', err);
      res.sendStatus(SERVER_ERROR);
    });
});

module.exports = router;
