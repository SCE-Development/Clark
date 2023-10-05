const express = require('express');
const axios = require('axios');
const router = express.Router();
const { speakerQueued } = require('../util/Speaker.js');
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
    .post(`http://host.docker.internal:18000/stream/?url=${encodeURIComponent(req.query.url)}`)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(500);
    });
});

router.post('/pause', async (req, res) => {
  /*
     * How these work with Quasar:
     * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
     */
  console.error(req.body);
  await axios
    .post(`http://host.docker.internal:18000/pause`)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(500);
    });
});

router.post('/resume', async (req, res) => {
  /*
     * How these work with Quasar:
     * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
     */
  console.error(req.body);
  await axios
    .post(`http://host.docker.internal:18000/resume`)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('Printer SSH tunnel is down: ', err);
      return res.sendStatus(500);
    });
});

router.get('/queued', async (req, res) => {
  /*
  * How these work with Quasar:
  * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
  */
  const dataFromQueued = await speakerQueued();
  if(!dataFromQueued) {
    return res.sendStatus(SERVER_ERROR);
  }
  return res.status(OK).json(dataFromQueued);
});

module.exports = router;