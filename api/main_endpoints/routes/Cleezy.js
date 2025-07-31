const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  decodeToken,
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');
const { Cleezy } = require('../../config/config.json');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const { ENABLED } = Cleezy;

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
  const { page = 0, search, sortColumn = 'created_at', sortOrder = 'DESC'} = req.query;
  if (!checkIfTokenSent(req)) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await decodeToken(req)) {
    return res.sendStatus(UNAUTHORIZED);
  }
  try {
    const response = await axios.get(CLEEZY_URL + '/list', {
      params: {
        page,
        ...(search !== undefined && { search }),
        // eslint-disable-next-line camelcase
        sort_by: sortColumn,
        order: sortOrder
      },
    });
    const { data = [], total, rows_per_page: rowsPerPage } = response.data;
    const returnData = data.map(element => {
      const u = new URL(element.alias, URL_SHORTENER_BASE_URL);
      return { ...element, link: u.href };
    });
    res.json({ data: returnData, total, rowsPerPage });
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

const searchCleezyUrls = async (req) => {
  if(!ENABLED || !req.body.query) {
    return { status: OK, data: [] };
  }

  if (!checkIfTokenSent(req)) {
    return { status: FORBIDDEN, data: [] };
  } else if (!checkIfTokenValid(req, membershipState.OFFICER)) {
    return { status: UNAUTHORIZED, data: [] };
  }

  try {
    const cleezyQuery = req.body.query.replace(/[^a-zA-Z0-9]/g, '');
    const cleezyRes = await axios.get(CLEEZY_URL + '/list', {
      params: {
        search: cleezyQuery
      }
    });
    const cleezyData = cleezyRes.data?.data
      .slice(0, 5)
      .map(e => {
        const u = new URL(e.alias, URL_SHORTENER_BASE_URL);
        return { ...e, link: u.href };
      });

    return { status: OK, data: cleezyData };
  } catch (err) {
    logger.error('cleezy search urls had an error', err);
    return { status: SERVER_ERROR, data: [] };
  }
};

module.exports = {router, searchCleezyUrls};
