const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');
const { Cleezy } = require('../../config/config.json');
const { ENABLED } = Cleezy;
const cleezyHelpers = require('../util/cleezyHelpers.js');

let CLEEZY_URL = process.env.CLEEZY_URL
  || 'http://localhost:8000';
let URL_SHORTENER_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://sce.sjsu.edu/s/' : 'http://localhost:8000/find/';

router.get('/list', async (req, res) => {
  if(!ENABLED) {
    return res.json({
      disabled: true
    });
  }
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  try {
    const returnData = await cleezyHelpers.searchCleezyUrls(req);
    res.json(returnData);
  } catch (err) {
    logger.error('/listAll had an error', err);
    if (err.response && err.response.data) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(SERVER_ERROR).json({ error: 'Failed to list URLs' });
    }
  }
});

router.post('/createUrl', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { url, alias, expiresAt } = req.body;
  let jsonbody = { url, alias: alias || null };
  // eslint-disable-next-line camelcase
  if (expiresAt) jsonbody.expires_at = expiresAt;
  try {
    const response = await axios.post(CLEEZY_URL + '/create_url', jsonbody);
    const data = response.data;
    const u = new URL( data.alias, URL_SHORTENER_BASE_URL);
    res.json({ ...data, link: u });
  } catch (err) {
    logger.error('/createUrl had an error', err);
    res.status(err.response.status).json({ error: err.response.data?.detail || err.response.data || 'Unknown error from Cleezy' });
  }
});

router.post('/deleteUrl', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  const { alias } = req.body;
  axios
    .post(CLEEZY_URL + '/delete/' + alias)
    .then(() => {
      res.sendStatus(OK);
    })
    .catch(err => {
      logger.error('/deleteUrl had an error', err);
      res.status(err.response.status).json({ error: err.response.status });
    });
});

module.exports = router;
