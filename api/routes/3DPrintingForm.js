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
      return res.sendStatus(INTERNAL_SERVER_ERROR)
    }

    return res.json(post)
  })
})

router.post('/GetForm', (req, res) => {
  PrintingFormFor3DPrinting.find({}, (error, forms) => {
    if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)

    return res.status(OK).send(forms)
  })
})

// This hasn't been used yet
router.post('/Delete3DForm', (req, res) => {
  PrintingFormFor3DPrinting.deleteOne({ PF3D: req.body.PF3D }, function (
    error,
    form
  ) {
    if (error) return res.sendStatus(INTERNAL_SERVER_ERROR)

    if (form.n < 1) {
      res.status(NOT_FOUND).send({ message: 'Form not found.' })
    } else {
      res.status(OK).send({ message: `${req.body.PF3D} was deleted.` })
    }
  })
})

module.exports = router
