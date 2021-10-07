const fs = require('fs');
const express = require('express');
const { exec } = require('child_process');
const router = express.Router();
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;

router.post('/healthCheck', (req, res) => {
  res.sendStatus(OK);
});

router.post('/sendPrintRequest', (req, res) => {
  const { raw } = req.body;
  let buf = Buffer.from(raw, 'base64');
  const fileName = `/tmp/${Math.random()}.pdf`;

  fs.writeFile(fileName, buf, error => {
    if (error) {
      throw error;
    }
    exec(
      'lp -n 1 -o sides=one-sided -d '
      + `HP_LaserJet_P2015_Series__15CD32_ ${fileName}`,
      (error, stdout, stderr) => {
        exec(`rm ${fileName}`, () => { });
        if (error) {
          throw error;
        }
        if (stderr) {
          throw stderr;
        }
      });
  });
  res.sendStatus(OK);
});
module.exports = router;
