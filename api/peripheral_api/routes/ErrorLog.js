const express = require('express');
const router = express.Router();
const ErrorLog = require('../models/ErrorLog');
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');

router.post('/addErrorLog', async (req, res) => {
  const newError = new ErrorLog({
    userEmail: req.body.userEmail,
    errorTime: req.body.errorTime,
    apiEndpoint: req.body.apiEndpoint,
    errorDescription: req.body.errorDescription
  });
  newError.save(function(error) {
    if (error) {
      logger.error('Unable to save error log: ', error);
      res.sendStatus(BAD_REQUEST);
    } else {
      res.sendStatus(OK);
    }
  });
});

router.get('/getErrorLogs', (req, res) => {
  ErrorLog.find()
    .sort({ errorTime: -1 })
    .then(errorLogs => res.status(OK).send(errorLogs));
});

module.exports = router;
