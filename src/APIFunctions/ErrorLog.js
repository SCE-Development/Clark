import axios from 'axios'

/**
 * Retrieve all errors.
 * @returns {Object[]} an array of all errors
 */
export async function getAllErrorLogs() {
  let allErrorLogs = []
  await axios
    .get('api/ErrorLog/getErrorLogs')
    .then(res => {
      allErrorLogs = res.data
    })
    .catch(err => {
      allErrorLogs = err
    })
  return allErrorLogs
}

/**
 * Add a new error.
 * @param {Object} newError - The error that is to be added
 * @param {(string|undefined)} newError.userEmail - The email of the user who has sent this error
 * @param {(string|undefined)} newError.errorTime- The time the error occured
 * @param {string} newError.apiEndpoint - The location of the error
 * @param {string} newError.errordescription - The description of the error
 */
export async function addErrorLog(newError) {
  let errorCreated = true

  await axios.post('api/ErrorLog/addErrorLog', { ...newError })
    .catch(() => {
      errorCreated = false
    })
  return errorCreated
}
