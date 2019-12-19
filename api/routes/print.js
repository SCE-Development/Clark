'use strict'

const express = require('express')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const {
  sendPrintRequest
} = require('../../printingRPC/client/printing/print_client')
const { OK } = require('../constants').STATUS_CODES

router.post('/submit', (req, res) => {
  const { raw, pageRanges, sides, copies, destination } = req.body
  sendPrintRequest(raw, copies, sides, pageRanges, destination)
  return res.sendStatus(OK)
})

module.exports = router
