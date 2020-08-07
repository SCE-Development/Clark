const express = require('express');
const router = express.Router();
const { SceGoogleApiHandler } = require('../util/SceGoogleApiHandler');
const { OK, NOT_FOUND } = require('../../util/constants').STATUS_CODES;

router.post('/addToSpreadsheet', async (req, res) => {
  const scopes = [ 'https://sheets.google.com/' ];
  const pathToToken = __dirname + '/../../config/sheets.json';
  const apiHandler = new SceGoogleApiHandler(scopes, pathToToken);
  const sheetsId = req.body.sheetsId;
  const row = req.body.row;
  apiHandler
    .writeToForm(sheetsId, row)
    .then((sheetsData) => {
      res.status(OK).send({ sheetsData });
    })
    .catch((error) => {
      res.status(NOT_FOUND).send(error);
    });
});

module.exports = router;
