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
let SPEAKER_URL = process.env.SPEAKER_URL
|| 'http://localhost:8000';


router.get('/queued', async (req, res) => {
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
  return res.status(OK).json({asdf: 1});
  await axios
    .post(SPEAKER_URL + path, body)
    .then(() => {
      return res.sendStatus(OK);
    })
    .catch((err) => {
      return res.sendStatus(SERVER_ERROR);
    });
}

router.post('/pause', sendSpeakerRequest);

router.post('/resume', sendSpeakerRequest);

router.post('/skip', sendSpeakerRequest);

router.post('/stream', async (req, res) => {
  sendSpeakerRequest(req, res, { url: req.body.url});
});

module.exports = router;
