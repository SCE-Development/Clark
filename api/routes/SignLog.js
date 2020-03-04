const express = require('express')
const router = express.Router()
const SignLog = require('../models/SignLog')
const { OK, BAD_REQUEST } = require('../constants').STATUS_CODES

router.post('/addSignLogs', (req, res) => {
  const newSign = new SignLog({
    signTitle: req.body.signTitle,
    firstName: req.body.firstName,
    email: req.body.email,
    timeOfPosting: req.body.timeOfPosting
  })

  newSign.save(function (error) {
    if (error) {
      res.sendStatus(BAD_REQUEST)
    } else {
      res.sendStatus(OK)
    }
  })
})

router.get('/getSignLogs', (req, res) => {
  SignLog.find()
    .sort({ timeOfPosting: -1 })
    .then(signLogs => res.status(OK).send(signLogs))
})

module.exports = router
