const express = require('express');
const router = express.Router();
const PrintingLog = require('../models/PrintingLog');
const { OK, BAD_REQUEST } = require('../constants').STATUS_CODES;

router.post('/addPrintLog', (req, res) => {
  const newPrint = new PrintingLog({
    numPages: req.body.numPages,
    chosenPrinter: req.body.chosenPrinter,
    printedDate: req.body.printedDate,
    memberName: req.body.memberName,
  });

  newPrint.save(function (error) {
    if (error) {
      res.sendStatus(BAD_REQUEST);
    } else {
      res.sendStatus(OK);
    }
  });
});

router.get('getPrintLogs', (req, res) => {
  PrintingLog.find()
    .sort({ printedDate: -1 })
    .then((printingLogs) => res.status(OK).send(printingLogs));
});

module.exports = router;
