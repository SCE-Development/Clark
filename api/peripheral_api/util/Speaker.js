const axios = require('axios');
const logger = require('../../util/logger');

let SPEAKER_URL = process.env.SPEAKER_URL
  || 'http://localhost:8000';

async function sendSpeakerRequest(path, body={}) {
  return new Promise((resolve) => {
    axios
    .post(SPEAKER_URL + path, body)
    .then(() => {
      resolve(true);
    })
    .catch((err) => {
      logger.error(`${path} had an error:`, err);
      resolve(false);
    });
  })
}

const getQueued = () => axios.get(SPEAKER_URL + '/queued');

module.exports = { sendSpeakerRequest, getQueued };
