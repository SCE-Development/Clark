const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND
} = require('../../util/constants').STATUS_CODES;

router.get('/getAuditLogs', (req, res) => {
  AuditLog.find()
    .populate('userId', 'firstName lastName') // joins User collection based on the userId
    .then(items => res.status(OK).send(items))
    .catch(error => {
      res.sendStatus(BAD_REQUEST);
    });
});

module.exports = router;
