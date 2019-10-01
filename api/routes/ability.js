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
const Ability = require('../models/Ability.js')
const settings = require('../../util/settings')
const logger = require(`${settings.util}/logger`)

const { INTERNAL_SERVER_ERROR, OK } = {
  INTERNAL_SERVER_ERROR: 500,
  OK: 200
}

router.post('/getAll', (req, res) => {
  Ability.find({}, (error, abilities) => {
    if (error) {
      logger.log(`ability /getAll error: ${error}`)
      return res.sendStatus(INTERNAL_SERVER_ERROR)
    }

    return res.status(OK).send(abilities)
  })
})

module.exports = router
