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
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');

router.post('/stream', async (req, res) => {
  logger.error("IT IS HERE")
  if (!checkIfTokenSent(req)) {
    logger.warn('/updateSignText was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  console.log("Final")
  console.log(req.body.url)
  await axios
    .post('http://host.docker.internal:18000/stream', {'url' : req.body.url})
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('/Speaker/stream had an error: ', err);
      return res.sendStatus(SERVER_ERROR);
    });
});

router.post('/pause', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/updateSignText was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  await axios
    .post('http://host.docker.internal:18000/pause')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('/Speaker/stream had an error: ', err);
      return res.sendStatus(SERVER_ERROR);
    });
});

router.post('/resume', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/updateSignText was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  await axios
    .post('http://host.docker.internal:18000/resume')
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error('/Speaker/stream had an error: ', err);
      return res.sendStatus(SERVER_ERROR);
    });
});

router.get('/queued', async (req, res) => {
  if (!checkIfTokenSent(req)) {
    logger.warn('/updateSignText was requested without a token');
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn('/updateSignText was requested with an invalid token');
    return res.sendStatus(UNAUTHORIZED);
  }
  const dataFromQueued = await speakerQueued();
  console.debug(dataFromQueued);
  if(!dataFromQueued) {
    return res.sendStatus(SERVER_ERROR);
  }
  return res.status(OK).json(dataFromQueued);
});

module.exports = router;
