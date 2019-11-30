'use strict'

// Includes (include as many as you need; the bare essentials are included here)
const express = require('express')
const router = express.Router()
const Manager = require('../models/OfficerManager.js')
const settings = require('../../util/settings')
const logger = require(`${settings.util}/logger`)
const jwt = require('jsonwebtoken')

const passport = require('passport')
require('../config/passport')(passport)
const config = require('../config/config')

const { OK, NOT_FOUND, UNAUTHORIZED, BAD_REQUEST } = {
  OK: 200,
  NOT_FOUND: 404,
  UNAUTHORIZED: 401,
  BAD_REQUEST: 400
}

// Post Api
router.post('/submit', (req, res) => {
  const data = {
    ...req.body
  }

  Manager.create(data, (error, post) => {
    if (error) {
      logger.log(`Officer Manager /submit error: ${error}`)
      return res.sendStatus(BAD_REQUEST)
    }

    return res.status(OK).send(post)
  })
})

// Find all api
router.post('/GetForm', (req, res) => {
  // Query Criteria, query all if empty
  let obj = {}
  if (typeof req.body.email !== 'undefined') obj = { email: req.body.email }

  Manager.find(obj, (error, forms) => {
    if (error) {
      logger.log(`Officer Manager /GetForm error: ${error}`)
      return res.sendStatus(BAD_REQUEST)
    }

    return res.status(OK).send(forms)
  })
})

// Delete request
// querry by email
router.post('/delete', (req, res) => {
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      Manager.deleteOne({ email: req.body.email }, function (error, form) {
        if (error) {
          logger.log(`Officer Manager /Delete3DForm error: ${error}`)
          return res.sendStatus(BAD_REQUEST)
        }

        if (form.n < 1) {
          logger.log(`Officer Manager /Delete3DForm error: ${error}`)
          res.status(NOT_FOUND).send({ message: 'Form not found.' })
        } else {
          logger.log(`Officer Manager /Delete3DForm deleted: ${req.body.name}`)
          res.status(OK).send({ message: `${req.body.name} was deleted.` })
        }
      })
    }
  })
})

// Edit/Update a member record
// querry by email
router.post('/edit', (req, res) => {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')
  const query = { email: req.body.email }
  const form = {
    ...req.body
  }

  // Remove the auth token from the form getting edited
  delete form.token

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Build this out to search for a user
      Manager.updateOne(query, { ...form }, function (error, result) {
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
    }
  })
})

module.exports = router
