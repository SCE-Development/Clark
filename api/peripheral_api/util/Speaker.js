const axios = require('axios');
const logger = require('../../util/logger');
/**
 * Send an HTTP GET request to the Spaker to see if it is up.
 * @returns {Promise<Object|boolean>} If the speaker is up, a JSON response
 * is returned. 
 * The JSON returned looks like:
 * {
 *   "queued": [url]
 * }
 * If the sign is unreachable, false is returned.
 */
async function speakerQueued() {
  return new Promise((resolve) => {
    axios
      .get('http://host.docker.internal:18000/Speaker/queued')
      .then(({data}) => {
        console.debug(data)
        resolve(data);
      }).catch((err) => {
        logger.error('speaker had an error: ', err);
        resolve(false);
      });
  });
}

module.exports = { speakerQueued };
