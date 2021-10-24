const express = require('express');
const axios = require('axios');
const router = express.Router();
const { LED_SIGN_URL } = require('../../config/config.js'); 

// send as part of request body which isn't present in url
router.use(express.json());

router.get('/healthCheck', (req, res) => {
  axios.get(LED_SIGN_URL + 'api/health-check')
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error('ERROR', error);
    });
});

router.post('/updateSignText', (req, res) => {
  axios.post(LED_SIGN_URL + 'api/update-sign', req.body)
    .then(response => {
      res.send(response.data);
    })
    .catch(error => {
      console.error('ERROR', error);
    });
});

module.exports = router;