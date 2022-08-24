const axios = require('axios');
const PERIPHERAL_API_URL = process.env.PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';
/**
 * Add a new error by calling on the ErrorLog API.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} errorToAdd.userEmail - The email of the user
 *                                                  who has sent this error
 * @param {(string|undefined)} errorToAdd.errorTime- The time the error occured
 * @param {string} errorToAdd.apiEndpoint - The location of the error
 * @param {string} errorToAdd.errordescription - The description of the error
 * @returns {boolean} - Whether the save was successul or not
 */
async function addErrorLog(errorToAdd) {
  let errorSaved = true;
  await axios.post(PERIPHERAL_API_URL + '/api/ErrorLog/addErrorLog',
    { ...errorToAdd })
    .catch(err => {
      errorSaved = false;
    });
  return errorSaved;
}

module.exports = { addErrorLog, addSignLog };
