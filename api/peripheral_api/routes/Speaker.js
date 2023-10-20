const express = require('express');
const axios = require('axios');
const router = express.Router();
const {
  verifyToken,
  checkIfTokenSent,
} = require('../../util/token-verification');
const {
  OK,
  UNAUTHORIZED,
  SERVER_ERROR,
} = require('../../util/constants').STATUS_CODES;
const logger = require('../../util/logger');
const { sendSpeakerRequest, getQueued } = require('../util/Speaker');
const { Speakers = {} } = require('../../config/config.json');
const { ENABLED = false } = Speakers;

router.get('/queued', async (req, res) => {
  if (!ENABLED) {
    logger.warn('Speakers are disabled, returning 200 to mock the speaker server');
    return res.json({
      disabled: true
    });
  }
  const token = req.query.token;
  if (!token) {
    return res.sendStatus(FORBIDDEN);
  } else if (!await verifyToken(req.query.token)) {
    return res.sendStatus(UNAUTHORIZED);
  }

  try {
    const response = await getQueued();
    const data = response.data;
    return res.json(data);
  } catch (err) {
    logger.error('/getQueued had an error', err);
    if (err.response && err.response.data) {
      res.status(err.response.status).json({ error: err.response.data });
    } else {
      res.status(SERVER_ERROR).json({ error: 'Failed to get queued songs' });
    }
  }
});

router.post('/pause', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path, res);
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

router.post('/resume', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path, res);
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

router.post('/skip', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path, res);
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

router.post('/stream', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path, res, { url: req.body.url });
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

module.exports = router;
