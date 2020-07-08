const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('./SceGoogleApiHandler');
const verification = require('./templates/verification');
const { validateVerificationEmail, generateHashedId } = require('./auth');
const {
  OK,
  NOT_FOUND,
  BAD_REQUEST
} = require('../constants').STATUS_CODES;
const config = require('../config/config');
const { USER } = config.googleApiKeys;

router.post('/sendVerificationEmail', async (req, res) => {
  const scopes = ['https://mail.google.com/'];
  const pathToToken = __dirname + '/../config/token.json';
  const apiHandler = new SceGoogleApiHandler(
    scopes, pathToToken);
  const tokenJson = await apiHandler.checkIfTokenFileExists();

  if (tokenJson) {
    if (apiHandler.checkIfTokenIsExpired(tokenJson)) {
      apiHandler.refreshToken();
    }
  } else {
    apiHandler.getNewToken();
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

router.post('/validateVerificationEmail', async (req, res) => {
  validateVerificationEmail(
    req.body.email, req.body.hashedId)
    .then((_) => {
      res.sendStatus(OK);
    })
    .catch((err) => {
      res.sendStatus(BAD_REQUEST);
    });
});

router.get('/getCalendarEvents', async (req, res) => {
  const scopes = ['https://calendar.google.com/'];
  const pathToToken = __dirname + '/../config/token.json';
  const apiHandler = new SceGoogleApiHandler(
    scopes, pathToToken);
  const calendarID = req.query.calendarID || 'primary';
  const numOfEvents = req.query.numOfEvents;
  if (numOfEvents < 0) {
    res.sendStatus(BAD_REQUEST);
  }
  apiHandler.getEventsFromCalendar(calendarID, numOfEvents)
    .then(calendarEvents => {
      res.status(OK).send({ calendarEvents });
    })
    .catch(_ => {
      res.sendStatus(NOT_FOUND);
    });
});

router.post('/addEventToCalendar', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/calendar.events'];
  const pathToToken = __dirname + '/../config/token.json';
  const apiHandler = new SceGoogleApiHandler(
    scopes, pathToToken);
  const calendarID = req.query.calendarID || 'primary';
  const event = req.body.newEvent;
  apiHandler.addEventToCalendar(calendarID, event)
    .then(event => {
      res.status(OK).send(event);
    })
    .catch(err => {
      if(err) {
        res.status(BAD_REQUEST).send({ err, message: 'Getting event failed' });
      }
    });
});

module.exports = router;
