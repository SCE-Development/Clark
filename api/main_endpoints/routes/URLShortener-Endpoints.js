const express = require('express');
const axios = require('axios');
const router = express.Router();

let URL_SHORTENER_BASE_URL = 'http://localhost:8000';

router.get('/listAll', async (req, res) => {
  try {
    const response = await axios.get(URL_SHORTENER_BASE_URL + '/list');
    const data = response.data;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list URLs' });
  }
});

router.post('/createURL', async (req, res) => {
  const { url, alias } = req.body;

  const response = await axios
    .post(URL_SHORTENER_BASE_URL + '/create_url', { 'url': url, 'alias': alias })
    .then(response => {
      res.json({ status: response.status });
    })
    .catch(err => {
      console.log(err.response.status);
      res.json({ error: err.response.status });
    });
});

router.post('/deleteURL', async (req, res) => {
  const { alias } = req.body;

  const response = await axios
    .post(URL_SHORTENER_BASE_URL + '/delete/' + alias)
    .then(response => {
      res.json({ status: response.status });
    })
    .catch(err => {
      console.log(err.response.status);
      res.json({ error: err.response.status });
    });
});

module.exports = router;
