const axios = require('axios');
const logger = require('../../util/logger');

/**
 * These functions are meant only for use in production, where the
 * Speaker can be reached from Clark through an SSH tunnel. Want
 * to learn more about how this works? Check out the below link:
 * https://github.com/SCE-Development/Quasar/wiki/How-Does-the-LED-Sign-Work%3F
 */


// Makes a post request to stream data,
// if success then returns true else will return false

async function stream(data) {
  return new Promise((resolve) => {
    axios
      .post('http://host.docker.internal:18000/stream', data)
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('updateSign had an error: ', err);
        resolve(false);
      });
  });
}

// Makes a post request to stream data,
// if success then returns true else will return false
async function pause() {
  return new Promise((resolve) => {
    axios
      .post('http://host.docker.internal:18000/pause')
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('updateSign had an error: ', err);
        resolve(false);
      });
  });
}

/** Makes a post request to stream data,
 * if success then returns true else will return false
 **/
async function skip() {
  return new Promise((resolve) => {
    axios
      .post('http://host.docker.internal:18000/skip')
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('updateSign had an error: ', err);
        resolve(false);
      });
  });
}

/** Makes a post request to stream data,
 * if success then returns true else will return false
 **/
async function resume() {
  return new Promise((resolve) => {
    axios
      .post('http://host.docker.internal:18000/resume')
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('updateSign had an error: ', err);
        resolve(false);
      });
  });
}



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
      .get('http://host.docker.internal:18000/health-check')
      .then(({data}) => {
        resolve(data);
      }).catch((err) => {
        logger.error('healthCheck had an error: ', err);
        resolve(false);
      });
  });
}

module.exports = { pause, resume, skip, stream, healthCheck };
