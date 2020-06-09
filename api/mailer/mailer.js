const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('./SceGoogleApiHandler');
const verification = require('./templates/verification');
const { validateVerificationEmail, generateHashedId } = require('./auth');
const {
  OK,
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

router.post('/getCalendarEvents', async (req, res) => {
  let calendarID = req.query.calendarID;
  const numOfEvents = req.query.numOfEvents;
  console.log('Made it here');
  if (typeof calendarID === 'undefined') {
    calendarID = 'primary';
    console.log('You dun goofed')
    res.sendStatus(BAD_REQUEST);
  }
  else if (numOfEvents < 0) {
    console.log('Ur events suck');
    res.sendStatus(BAD_REQUEST);
  }
  console.log(`${calendarID} : ${numOfEvents}`);
  const calendarEvents = await getEventsFromCalendar(calendarID, numOfEvents);
  console.log(calendarEvents);
  res.status(OK).send({ calendarEvents });
});

module.exports = router;
