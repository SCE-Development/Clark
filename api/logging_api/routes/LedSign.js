const express = require('express');
const axios = require('axios');
const router = express.Router();
const { LED_SIGN_URL } = require('../../config/config.js');
const { OK, BAD_REQUEST } = require('../../util/constants').STATUS_CODES;

// send as part of request body which isn't present in url
router.use(express.json());

router.get('/healthCheck', (req, res) => {
  axios.get(LED_SIGN_URL + 'healthCheck')
    .then(response => {
      res.status(OK).send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(BAD_REQUEST).send(error);
    });
});

router.post('/updateSignText', (req, res) => {
  axios.post(LED_SIGN_URL + 'updateSignText', req.body)
    .then(response => {
      res.status(OK).send(response.data);
    })
    .catch(error => {
      console.log(error);
      res.status(BAD_REQUEST).send(error);
    });
});

module.exports = router;
