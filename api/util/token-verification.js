const { DISCORD_COREV4_KEY } = require('../config/config.json');

/**
 * Checks API key value and return true or false depending on if it matches
 * @param {String} apiKey
 * @returns {boolean} whether the api key was valid or not
 */
function checkDiscordKey(apiKey) {
  return apiKey === DISCORD_COREV4_KEY;
}
module.exports = { checkDiscordKey };
