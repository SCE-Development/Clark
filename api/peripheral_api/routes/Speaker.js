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
const logger = require('../../util/logger');
const { music } = require('../../config/config.json');
const { ENABLED } = music;


router.post('/stream', async (req, res) => {
  /*
     * How these work with Quasar:
     * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
     */
  console.error(req.body);
  await axios
    .post(`http://host.docker.internal:18000/stream/?url=${req.body}`)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(NOT_FOUND);
    });
});

module.exports = router;