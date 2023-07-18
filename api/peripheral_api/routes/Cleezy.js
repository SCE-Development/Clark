const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  verifyToken,
  checkIfTokenSent,
} = require('../../util/token-verification');
const {
  OK,
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  NOT_FOUND,
} = require('../../util/constants').STATUS_CODES;
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;

let CLEEZY_URL = process.env.CLEEZY_URL
  || 'http://localhost:8000';
let URL_SHORTENER_BASE_URL = 
  process.env.NODE_ENV === 'production' ? 'https://sce.sjsu.edu/s/' : 'http://localhost:8000/find/';

router.get('/listAll', async (req, res) => {
  const token = req.query.token;
  const tokenReq = { body: { token } };
  if (!token) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await verifyToken(req.query.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  try {
    const response = await axios.get(CLEEZY_URL + '/list');
    const data = response.data;
    const returnData = data.map(element => {
      const u = new URL(element.alias, URL_SHORTENER_BASE_URL);
      return { ...element, link: u.href };
    });
    res.json(returnData);
  } catch (err) {
    if (err.response && err.response.data) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(500).json({ error: 'Failed to list URLs' });
    }
  }
});

router.post('/createURL', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await verifyToken(req.body.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { url, alias } = req.body;
  let jsonbody = { url, alias: alias || null };
  try {
    const response = await axios.post(CLEEZY_URL + '/create_url', jsonbody);
    const data = response.data;
    const u = new URL( data.alias, URL_SHORTENER_BASE_URL);
    res.json({ ...data, link: u });
  } catch (err) {
    res.status(err.response.status).json({ error: err.response.status });
  }
});

router.post('/deleteURL', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await verifyToken(req.body.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { alias } = req.body;
  const response = await axios
    .post(CLEEZY_URL + '/delete/' + alias)
    .then(response => {
      res.json({ status: response.status });
    })
    .catch(err => {
      res.status(err.response.status).json({ error: err.response.status });
    });
});

module.exports = router;
