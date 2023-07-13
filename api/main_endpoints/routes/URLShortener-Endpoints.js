const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

let URL_SHORTENER_BASE_URL = 'http://localhost:8000';

router.get('/listAll', async (req, res) => {
  const token = req.query.token;
  const tokenReq = { body: { token } };
  console.log(tokenReq);
  if (!token) {   
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(tokenReq, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  try {
    const response = await axios.get(URL_SHORTENER_BASE_URL + '/list');
    const data = response.data;
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to list URLs' });
  }
});

router.post('/createURL', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { url, alias } = req.body;
  let jsonbody = { url, alias: alias || null };
  const response = await axios
    .post(URL_SHORTENER_BASE_URL + '/create_url', jsonbody)
    .then(response => {
      res.json({ status: response.status });
    })
    .catch(err => {
      res.json({ error: err.response.status });
    });
});

router.post('/deleteURL', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { alias } = req.body;
  const response = await axios
    .post(URL_SHORTENER_BASE_URL + '/delete/' + alias)
    .then(response => {
      res.json({ status: response.status });
    })
    .catch(err => {
      res.json({ error: err.response.status });
    });
});

module.exports = router;
