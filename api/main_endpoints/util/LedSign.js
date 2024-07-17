const axios = require('axios');
const logger = require('../../util/logger');
const { metrics } = require('../../util/metrics');


// see https://github.com/SCE-Development/rpi-led-controller/tree/master/server.py#L126
let LED_SIGN_URL = process.env.LED_SIGN_URL
  || 'http://localhost';

/**
 * These functions are meant only for use in production, where the
 * LED sign can be reached from Core-v4 through an SSH tunnel. Want
 * to learn more about how this works? Check out the below link:
 * https://github.com/SCE-Development/Quasar/wiki/How-Does-the-LED-Sign-Work%3F
 */

/**
 * Send an object to update the LED sign with.
 * @param {Object} data The new sign data, for example
 * {
 *   "scrollSpeed": 15,
 *   "backgroundColor": "#0000FF",
 *   "textColor": "#00FF00",
 *   "borderColor": "#FF0000",
 *   "text": "Welcome to SCE!",
 * }
 * @returns {Promise<boolean>} Whether the LED Sign's API can be reached or not.
 */
async function updateSign(data) {
  return new Promise((resolve) => {
    axios
      .post(LED_SIGN_URL + '/api/update-sign', data)
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('updateSign had an error: ', err);
        resolve(false);
      });
  });
}

/**
 * Turn the led sign off using its REST API.
 * @returns {Promise<Object>} Whether the turn off request worked or not.
 */
async function turnOffSign() {
  return new Promise((resolve) => {
    axios
      .get(LED_SIGN_URL + '/api/turn-off')
      .then(() => {
        resolve(true);
      }).catch((err) => {
        logger.error('turnOffSign had an error: ', err);
        resolve(false);
      });
  });
}

/**
 * Send an HTTP GET request to the LED sign to see if it is up.
 * @returns {Promise<Object|boolean>} If the sign is up, a JSON response
 * is returned. If there is no message on the sign, the response looks like
 * {
 *   "success": true
 * }
 * If there is a message on the sign, the JSON returned looks like:
 * {
 *   "scrollSpeed": 15,
 *   "backgroundColor": "#0000FF",
 *   "textColor": "#00FF00",
 *   "borderColor": "#FF0000",
 *   "text": "Welcome to SCE!",
 *   "success": true
 * }
 * If the sign is unreachable, false is returned.
 */
async function healthCheck() {
  return new Promise((resolve) => {
    axios
      .get(LED_SIGN_URL + '/api/health-check')
      .then(({ data }) => {
        resolve(data);
      }).catch((err) => {
        logger.error('healthCheck had an error: ', err);
        metrics.sshTunnelErrors.inc({ type: 'LED' });
        resolve(false);
      });
  });
}

module.exports = { updateSign, turnOffSign, healthCheck };
