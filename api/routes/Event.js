const express = require('express')
const router = express.Router()
const Event = require('../models/Event')
const settings = require('../../util/settings')
const logger = require(`${settings.util}/logger`)
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../../util/api-utils/token-functions')
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../constants')

router.get('/getEvents', (req, res) => {
  Event.find({}, (error, events) => {
    if (error) {
      logger.log(`Events /getEvents error: ${error}`)
      return res.sendStatus(BAD_REQUEST)
    }
    return res.status(OK).send(events)
  })
})

// create event -> pushing to db (admin)
router.post('/createEvent', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN)
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED)
  }
  logger.log(req.body.id)
  const newEvent = new Event({
    title: req.body.title,
    description: req.body.description,
    eventLocation: req.body.eventLocation,
    eventDate: req.body.eventDate,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    eventCategory: req.body.eventCategory
  })

  // create an event, store it
  Event.create(newEvent, (error, post) => {
    if (error) {
      logger.log(`Event /createEvent error: ${error}`)
      return res.sendStatus(BAD_REQUEST)
    }
    return res.json(post)
  })
})

// edit event -> pushing to db (admin)
router.post('/editEvent', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN)
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED)
  }
  const {
    title,
    description,
    eventLocation,
    eventDate,
    startTime,
    endTime,
    eventCategory
  } = req.body
  Event.findOne({ _id: req.body.id })
    .then(event => {
      event.title = title || event.title
      event.description = description || event.description
      event.eventLocation = eventLocation || event.eventLocation
      event.eventDate = eventDate || event.eventDate
      event.startTime = startTime || event.startTime
      event.endTime = endTime || event.endTime
      event.eventCategory = eventCategory || event.eventCategory
      // save updates
      event
        .save()
        .then(ret => {
          res.status(OK).json({ ret, event: 'event updated successfully' })
        })
        .catch(err => {
          res.status(BAD_REQUEST).send({
            err,
            message: 'event was not updated'
          })
        })
    })
    .catch(err => {
      res.status(NOT_FOUND).send({ err, message: 'event not found' })
    })
})

// delete event -> pushing to db (admin)
router.post('/deleteEvent', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN)
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED)
  }
  Event.deleteOne({ _id: req.body.id })
    .then(event => {
      res.status(OK).json({ event: 'event successfully deleted' })
    })
    .catch(err => {
      res.status(BAD_REQUEST).send({ err, message: 'deleting event failed' })
    })
})

module.exports = router
