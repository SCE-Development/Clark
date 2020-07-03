const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;
const addErrorLog = require ('../util/logging-helpers');

router.get('/getEvents', (req, res) => {
  Event.find()
    .sort({ eventDate: -1, startTime: -1 }) // Sort By date in descending order
    .then(items => res.status(OK).send(items))
    .catch(error => {
      const info = {
        errorTime: new Date(),
        apiEndpoint: 'Event/getEvents',
        errorDescription: error
      };
      addErrorLog(info);
      res.status(BAD_REQUEST).send({ error, message: 'Getting event failed' });
    });
});

router.post('/createEvent', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    eventLocation: req.body.eventLocation,
    eventDate: req.body.eventDate,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    eventCategory: req.body.eventCategory,
    imageURL: req.body.imageURL
  });

  Event.create(newEvent, (error, post) => {
    if (error) {
      return res.sendStatus(BAD_REQUEST);
    }
    return res.json(post);
  });
});

router.post('/editEvent', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const {
    title,
    description,
    eventLocation,
    eventDate,
    startTime,
    endTime,
    eventCategory,
    imageURL
  } = req.body;
  Event.findOne({ _id: req.body.id })
    .then(event => {
      event.title = title || event.title;
      event.description = description || event.description;
      event.eventLocation = eventLocation || event.eventLocation;
      event.eventDate = eventDate || event.eventDate;
      event.startTime = startTime || event.startTime;
      event.endTime = endTime || event.endTime;
      event.eventCategory = eventCategory || event.eventCategory;
      event.imageURL = imageURL || event.imageURL;
      event
        .save()
        .then(ret => {
          res.status(OK).json({ ret, event: 'event updated successfully' });
        })
        .catch(error => {
          res.status(BAD_REQUEST).send({
            error,
            message: 'event was not updated'
          });
        });
    })
    .catch(error => {
      res.status(NOT_FOUND).send({ error, message: 'event not found' });
    });
});

router.post('/deleteEvent', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  Event.deleteOne({ _id: req.body.id })
    .then(event => {
      res.status(OK).json({ event: 'event successfully deleted' });
    })
    .catch(error => {
      res.status(BAD_REQUEST).send({ error, message: 'deleting event failed' });
    });
});

module.exports = router;
