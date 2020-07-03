const express = require('express');
const router = express.Router();
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;
const SignLog = require('../models/SignLog');

router.post('/addSignLog', (req, res) => {
  const newSign = new SignLog({
    signText: req.body.signText,
    firstName: req.body.firstName,
    email: req.body.email,
    timeOfPosting: req.body.timeOfPosting
  });

  newSign.save(function(error) {
    if (error) {
      res.sendStatus(BAD_REQUEST);
    } else {
      res.sendStatus(OK);
    }
  });
});

router.get('/getSignLogs', (req, res) => {
  SignLog.find()
    .sort({ timeOfPosting: -1 })
    .then(signLogs => res.status(OK).send(signLogs));
});

module.exports = router;
