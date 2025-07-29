const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  decodeToken,
  checkIfTokenSent,
  checkIfTokenValid,
} = require('./token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  FORBIDDEN,
  SERVER_ERROR,
} = require('../../util/constants.js').STATUS_CODES;
const logger = require('../../util/logger.js');
const { Cleezy } = require('../../config/config.json');
const membershipState = require('../../util/constants.js').MEMBERSHIP_STATE;
const { ENABLED } = Cleezy;

let CLEEZY_URL = process.env.CLEEZY_URL
  || 'http://localhost:8000';
let URL_SHORTENER_BASE_URL =
  process.env.NODE_ENV === 'production' ? 'https://sce.sjsu.edu/s/' : 'http://localhost:8000/find/';

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

module.exports = {searchCleezyUrls};
