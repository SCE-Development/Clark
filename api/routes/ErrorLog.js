const express = require('express');
const router = express.Router();
const ErrorLog = require('../models/ErrorLog');
const { OK, BAD_REQUEST } = require('../constants').STATUS_CODES;
const { addErrorLog } = require('../util/errorLog-function');

router.post('/addErrorLog', async (req, res) => {
  if (!await addErrorLog(req)) {
    return res.sendStatus(BAD_REQUEST);
  } else {
    res.sendStatus(OK);
  }
});

router.get('/getErrorLogs', (req, res) => {
  ErrorLog.find()
    .sort({ errorTime: -1 })
    .then(errorLogs => res.status(OK).send(errorLogs));
});

module.exports = router;
