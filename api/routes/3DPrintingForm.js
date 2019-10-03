// PROJECT:   Core-v4
//  Name:    R. Javier
//  File:    api/routes/membershipApplication/index.js
//  Date Created:  March 17, 2019
//  Last Modified:  March 17, 2019
//  Details:
//      This file contains routing logic to service all routes requested under the the
//                  "/memberApplication" endpoint (a.k.a. the Membership Application Module)
//     which is publicly exposed to allow applications from the public facing site.
//  Dependencies:
//      JavaScript ECMAscript 6

'use strict'

// Includes (include as many as you need; the bare essentials are included here)
const express = require('express')
const router = express.Router()
const PrintingFormFor3DPrinting = require('../models/PrintingFormFor3DPrinting.js')
const settings = require('../../util/settings')
const logger = require(`${settings.util}/logger`)

const passport = require('passport')
require('../config/passport')(passport)

const { INTERNAL_SERVER_ERROR, OK, NOT_FOUND } = {
  INTERNAL_SERVER_ERROR: 500,
  OK: 200,
  NOT_FOUND: 404
}

router.post('/submit', (req, res) => {
  const data = {
    name: req.body.name,
    color: req.body.color,
    projectType: req.body.projectType,
    projectLink: req.body.url,
    projectContact: req.body.contact,
    projectComments: req.body.comment,
    progress: req.body.progress
  }

  PrintingFormFor3DPrinting.create(data, (error, post) => {
    if (error) {
      logger.log(`3DPrinting /submit error: ${error}`)
      return res.sendStatus(INTERNAL_SERVER_ERROR)
    }

    return res.json(post)
  })
})

router.post('/GetForm', (req, res) => {
  PrintingFormFor3DPrinting.find({}, (error, forms) => {
    if (error) {
      logger.log(`3DPrinting /GetForm error: ${error}`)
      return res.sendStatus(INTERNAL_SERVER_ERROR)
    }

    return res.status(OK).send(forms)
  })
})

/// This hasn't been used yet
router.post(
  '/Delete3DForm',
  // passport.authenticate('jwt', { session: false }),
  (req, res) => {
    //    const token = getToken(req.headers)

    // if (token) {
    PrintingFormFor3DPrinting.deleteOne(
      { name: req.body.name, color: req.body.color },
      function (error, form) {
        if (error) {
          logger.log(`3DPrinting /Delete3DForm error: ${error}`)
          return res.sendStatus(INTERNAL_SERVER_ERROR)
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
    // }
  }
)

// Edit/Update a member record
router.post('/edit', (req, res) => {
  // Strip JWT from the token
  // const token = req.body.token.replace(/^JWT\s/, '')
  const query = { name: req.body.name }
  const member = {
    ...req.body
  }
  logger.log('1 ', req.body)
  logger.log('Querry:  ', query)
  logger.log('Member:  ', member)
  // jwt.verify(token, config.secretKey, function (error, decoded) {
  // if (error) {
  // Unauthorized
  // res.sendStatus(401)
  // } else {
  // Ok
  // Build this out to search for a user
  PrintingFormFor3DPrinting.updateOne(query, { ...member }, function (
    error,
    result
  ) {
    if (error) {
      logger.log(error)
      return res.sendStatus(INTERNAL_SERVER_ERROR)
    }

    if (result.nModified < 1) {
      return res
        .status(NOT_FOUND)
        .send({ message: `${req.body.name} not found.` })
    }

    return res.status(OK).send({ message: `${req.body.name} was updated.` })
  })
  // }
  // })
})

// function getToken (headers) {
//   if (headers && headers.authorization) {
//     var parted = headers.authorization.split(' ')
//     if (parted.length === 2) {
//       return parted[1]
//     } else {
//       return null
//     }
//   } else {
//     return null
//   }
// }

module.exports = router
