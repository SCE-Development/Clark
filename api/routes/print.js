const express = require('express');
const router = express.Router();
const passport = require('passport');
require('../config/passport')(passport);
const {
  sendPrintRequest
} = require('../printingRPC/client/printing/print_client');
const { OK, BAD_REQUEST } = require('../constants').STATUS_CODES;

router.post('/submit', async(req, res) => {
  const { raw, pageRanges, sides, copies, destination } = req.body;
  await sendPrintRequest(raw, copies, sides, pageRanges, destination)
    .then(response => {
      return res.status(OK).send({ ...response });
    })
    .catch(err => {
      return res.status(BAD_REQUEST).send({ ...err });
    });
});

module.exports = router;
