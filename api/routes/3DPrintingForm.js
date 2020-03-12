'use strict'

const express = require('express')
const router = express.Router()
const PrintingForm3D = require('../models/PrintingForm3D.js')
const settings = require('../util/settings')
const logger = require(`${settings.util}/logger`)
const {
  checkIfTokenSent,
  checkIfTokenValid
} = require('../util/token-functions')
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND
} = require('../constants').STATUS_CODES

router.post('/submit', (req, res) => {
  const data = {
    name: req.body.name,
    color: req.body.color,
    projectType: req.body.projectType,
    projectLink: req.body.url,
    projectContact: req.body.contact,
    projectComments: req.body.comment,
    progress: req.body.progress,
    email: req.body.email
  }

  PrintingForm3D.create(data, (error, post) => {
    if (error) {
      logger.log(`3DPrinting /submit error: ${error}`)
      return res.sendStatus(BAD_REQUEST)
    }

    return res.status(OK).send(post)
  })
})

router.post('/GetForm', (req, res) => {
  // Query Criteria, query all if empty
  let obj = {}
  if (typeof req.body.email !== 'undefined') obj = { email: req.body.email }

  PrintingForm3D.find(obj, (error, forms) => {
    if (error) {
      logger.log(`3DPrinting /GetForm error: ${error}`)
      return res.sendStatus(BAD_REQUEST)
    }

    return res.status(OK).send(forms)
  })
})

router.post('/delete', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN)
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED)
  }
  PrintingForm3D.deleteOne(
    { email: req.body.email, date: req.body.date },
    function (error, form) {
      if (error) {
        logger.log(`3DPrinting /Delete3DForm error: ${error}`)
        return res.sendStatus(BAD_REQUEST)
      }

      if (form.n < 1) {
        logger.log(`3DPrinting /Delete3DForm error: ${error}`)
        res.status(NOT_FOUND).send({ message: 'Form not found.' })
      } else {
        logger.log(`3DPrinting /Delete3DForm deleted: ${req.body.name}`)
        res.status(OK).send({ message: `${req.body.name} was deleted.` })
      }
    }
  )
})

// Edit/Update a member record
router.post('/edit', (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN)
  } else if (!checkIfTokenValid(req)) {
    return res.sendStatus(UNAUTHORIZED)
  }
  const query = { email: req.body.email, date: req.body.date }
  const form = {
    ...req.body
  }

  // Remove the auth token from the form getting edited
  delete form.token

  PrintingForm3D.updateOne(query, { ...form }, function (error, result) {
    if (error) {
      logger.log(error)
      return res.sendStatus(BAD_REQUEST)
    }

    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.name} not found.` })
    }

    return res.status(OK).send({ message: `${req.body.name} was updated.` })
  })
})

module.exports = router
