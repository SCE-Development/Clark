const express = require('express');
const router = express.Router();
const axios = require('axios');
const {OK} = require('../../util/constants').STATUS_CODES;

router.post('/healthCheck', async (req, res) => {
  await axios.get('http://localhost:8000' + '/healthCheck')
    .then(result => {
      reponseData = res.data;
      res.sendStatus(OK);
    })
    .catch(err => {
      responseData = err;
      error = true;
    });
});

router.post('/sendPrintRequest', async (req, res) => {
  await axios.post('http://localhost:8000' + '/sendPrintRequest', req.body)
    .then(result => {
      reponseData = res.data;
      res.sendStatus(OK);
    })
    .catch(err => {
      responseData = err;
      error = true;
    });
});
module.exports = router;
