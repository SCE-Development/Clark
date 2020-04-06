const ErrorLog = require('../models/ErrorLog');

/**
 * Add a new error.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} req.body.userEmail - The email of the user
 *                                                  who has sent this error
 * @param {(string|undefined)} req.body.errorTime- The time the error occured
 * @param {string} req.body.apiEndpoint - The location of the error
 * @param {string} req.body.errordescription - The description of the error
 */
async function addErrorLog(userEmail, errorTime, apiEndpoint, errorDescription){
  let errorSaved = true;
  const newError = new ErrorLog({
    userEmail,
    errorTime,
    apiEndpoint,
    errorDescription
  });
  await newError.save()
    .catch(_ => {
      errorSaved = false;
    });
  return errorSaved;
}

module.exports = {addErrorLog};
