const express = require('express');
const router = express.Router();
const PrintLog = require('../models/PrintLog');
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;

router.post('/addPrintLog', (req, res) => {
  const newPrint = new PrintLog({
    numPages: req.body.numPages,
    chosenPrinter: req.body.destination,
    printedDate: req.body.printedDate,
    memberName: req.body.memberName
  });

  newPrint.save(function(error) {
    if (error) {
      res.sendStatus(BAD_REQUEST);
    } else {
      res.sendStatus(OK);
    }
  });
});

router.get('/getPrintLogs', (req, res) => {
  PrintLog.find()
    .sort({ printedDate: -1 })
    .then(printLogs => res.status(OK).send(printLogs));
});

module.exports = router;
