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
const Member = require('../models/Member.js')

const { INTERNAL_SERVER_ERROR, CONFLICT, OK } = {
  INTERNAL_SERVER_ERROR: 500,
  CONFLICT: 409,
  OK: 200
}

router.post('/username/isAvailable', (req, res) => {
  Member.findOne(
    {
      username: req.body.username.toLowerCase()
    },
    function (error, member) {
      if (error) {
        // Bad Request
        return res.status(400).send({ message: 'Bad Request.' })
      }

      if (!member) {
        // Member username does not exist
        res.sendStatus(OK)
      } else {
        // Member username does exist
        res.sendStatus(CONFLICT)
      }
    }
  )
})

router.post('/submit', async (req, res) => {
  // Use email to check if a user already exists
  const memberAlreadyExists = await Member.find(
    {
      email: req.body.email
    },
    (error, member) => {
      if (error) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
      }

      if (member.length) {
        return res.status(CONFLICT).send({ message: 'Member already exists.' })
      }
    }
  )

  if (!memberAlreadyExists.length) {
    const member = { ...req.body }

    Member.create(member, (error, post) => {
      if (error) {
        return res.sendStatus(INTERNAL_SERVER_ERROR)
      }

      return res.json(post)
    })
  }
})

module.exports = router
