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

router.post('/stream', async (req, res) => {
  /*
     * How these work with Quasar:
     * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
     */
  console.error(req.body);
  await axios
    .get(`http://host.docker.internal:18000/stream/?url=${encodeURIComponent(req.query.url)}`)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(500);
    });
});

module.exports = router;