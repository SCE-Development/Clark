const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const {
  OK,
  NOT_FOUND,
  BAD_REQUEST
} = require('../../util/constants').STATUS_CODES;

router.get('/getCalendarEvents', async (req, res) => {
  const scopes = ['https://calendar.google.com/'];
  const pathToToken = __dirname + '/../../config/token.json';
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

router.post('/addEventToCalendar', async (req, res) => {
  const scopes = ['https://calendar.google.com/'];
  const pathToToken = __dirname + '/../config/token.json';
  const apiHandler = new SceGoogleApiHandler(
    scopes, pathToToken);
  const calendarID = req.query.calendarID || 'primary';
  const { newEvent } = req.body;
  apiHandler.addEventToCalendar(calendarID, newEvent)
    .then(event => {
      res.status(OK).send({ event });
    })
    .catch(_ => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
