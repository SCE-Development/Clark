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

router.post('/login', (req, res) => {
  if (req.body.username) {
    console.log(req.body.username)
    res.sendStatus(200)
  } else {
    res.status(409).send({ message: 'unknown...' })
  }
})

router.post('/logout', (req, res) => {
  if (req.body.username) {
    console.log(req.body.username)
    res.sendStatus(200)
  } else {
    res.status(409).send({ message: 'unknown...' })
  }
})

router.post('/add', (req, res) => {
  if (req.body.username) {
    console.log(req.body.username)
    res.sendStatus(200)
  } else {
    res.status(409).send({ message: 'unknown...' })
  }
})

router.post('/delete', (req, res) => {
  if (req.body.username) {
    console.log(req.body.username)
    res.sendStatus(200)
  } else {
    res.status(409).send({ message: 'unknown...' })
  }
})

router.post('/search', (req, res) => {
  if (req.body.username) {
    console.log(req.body.username)
    res.sendStatus(200)
  } else {
    res.status(409).send({ message: 'unknown...' })
  }
})

router.post('/edit', (req, res) => {
  if (req.body.username) {
    console.log(req.body.username)
    res.sendStatus(200)
  } else {
    res.status(409).send({ message: 'unknown...' })
  }
})

module.exports = router
