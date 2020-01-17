const express = require('express')
const router = express.Router()
const {
  healthCheck,
  updateSignText
} = require('../../printingRPC/client/ledsign/led_sign_client')
const { OK, NOT_FOUND, BAD_REQUEST } = require('../constants').STATUS_CODES

router.post('/updateSignText', async (req, res) => {
  await updateSignText(req.body)
    .then(response => {
      return res.status(OK).send({ ...response })
    })
    .catch(err => {
      return res.status(BAD_REQUEST).send({ ...err })
    })
})

router.post('/healthCheck', async (req, res) => {
  const { officerName } = req.body
  await healthCheck(officerName)
    .then(response => {
      return res.status(OK).send({ ...response })
    })
    .catch(err => {
      return res.status(NOT_FOUND).send({ ...err })
    })
})

module.exports = router
