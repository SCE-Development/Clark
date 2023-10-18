const axios = require('axios');
const logger = require('../../util/logger');
let SPEAKER_URL = process.env.SPEAKER_URL
|| 'http://localhost:8000';

/**
 * Send an HTTP GET request to the speaker to see if it is up.
 * @returns {Promise<Object|boolean>} If the speaker is up, a JSON response
 * is returned. If there is no message on the sign, the response looks like
 * {
 *   "success": true
 * }
 * If the speaker is unreachable, false is returned.
 */
async function healthCheck() {
  return new Promise((resolve) => {
    axios
      .get(SPEAKER_URL + '/healthCheck')
      .then(({data}) => {
        resolve(data);
      }).catch((err) => {
        logger.error('healthCheck had an error: ', err);
        resolve(false);
      });
  });
}

module.exports = { healthCheck };
