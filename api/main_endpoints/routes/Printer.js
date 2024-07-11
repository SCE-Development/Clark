const axios = require('axios');
const express = require('express');
const logger = require('../../util/logger');
const {
  checkIfTokenSent,
  checkIfTokenValid,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  NOT_FOUND,
  SERVER_ERROR,
  BAD_REQUEST,
} = require('../../util/constants').STATUS_CODES;
const {
  PRINTING = {}
} = require('../../config/config.json');
const membershipState = require('../../util/constants').MEMBERSHIP_STATE;
const User = require('../models/User.js');

// see https://github.com/SCE-Development/Quasar/tree/dev/docker-compose.dev.yml#L11
let PRINTER_URL = process.env.PRINTER_URL
  || 'http://localhost:14000';

const router = express.Router();

router.get('/healthCheck', async (req, res) => {
/*
 * How these work with Quasar:
 * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
 */
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }
  await axios
    .get(PRINTER_URL + '/healthcheck/printer')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(NOT_FOUND);
    });
});

router.post('/sendPrintRequest', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/sendPrintRequest was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await checkIfTokenValid(req, membershipState.MEMBER)) {
    logger.warn('/sendPrintRequest was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!PRINTING.ENABLED) {
    logger.warn('Printing is disabled, returning 200 to mock the printing server');
    return res.sendStatus(OK);
  }

  const { raw, copies, pageRanges, sides, pagesPrinted, pagesToBeUsedInPrintRequest, email } = req.body;

  if (pagesPrinted + pagesToBeUsedInPrintRequest > 30) {
    logger.warn('Print request exceeded weekly limit');
    return req.sendStatus(BAD_REQUEST);
  }

  try {
    await axios.post(PRINTER_URL + '/print', {
      raw,
      copies,
      pageRanges,
      sides,
    });

    await User.findOne({ email: email })
      .then((user) => {
        user.pagesPrinted += pagesToBeUsedInPrintRequest;
        user.save();
      });

    res.sendStatus(OK);
  } catch (err) {
    logger.error('/sendPrintRequest had an error: ', err);
    res.sendStatus(SERVER_ERROR);
  }
});

module.exports = router;
