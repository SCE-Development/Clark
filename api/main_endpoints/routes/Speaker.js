const express = require('express');
const router = express.Router();
const {
  decodeToken,
  checkIfTokenSent,
} = require('../util/token-functions.js');
const {
  OK,
  UNAUTHORIZED,
  SERVER_ERROR,
  FORBIDDEN,
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
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
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
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path);
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
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path);
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
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path);
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

router.post('/forward', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path);
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

router.post('/rewind', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path);
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
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path, { url: req.body.url });
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

router.post('/volume', async (req, res) => {
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await decodeToken(req)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  const result = await sendSpeakerRequest(path, { url: req.body.volume });
  if (result) {
    return res.sendStatus(OK);
  }
  return res.sendStatus(SERVER_ERROR);
});

module.exports = router;
