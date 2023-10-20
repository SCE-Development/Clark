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
const { Speakers = {} } = require('../../config/config.json');
const { ENABLED = false } = Speakers;

let SPEAKER_URL = process.env.SPEAKER_URL
|| 'http://localhost:8000';


router.get('/queued', async (req, res) => {
  if(!ENABLED) {
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
    const response = await axios.get(SPEAKER_URL + '/queued');
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

async function sendSpeakerRequest(req, res, body = {}) {
  // path looks like /createEvent
  const { path } = req.route;
  if (!checkIfTokenSent(req)) {
    logger.warn(`${path} was requested without a token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  if (!await verifyToken(req.body.token)) {
    logger.warn(`${path} was requested with an invalid token`);
    return res.sendStatus(UNAUTHORIZED);
  }
  await axios
    .post(SPEAKER_URL + path, body)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      logger.error(`${path} had an error:`, err);
      return res.sendStatus(SERVER_ERROR);
    });
}

router.post('/pause', (req, res) => {
  sendSpeakerRequest(req, res);
});

router.post('/resume', (req, res) => {
  sendSpeakerRequest(req, res);
});

router.post('/skip', (req, res) => {
  sendSpeakerRequest(req, res);
});

router.post('/stream', (req, res) => {
  sendSpeakerRequest(req, res, { url: req.body.url});
});

module.exports = router;
