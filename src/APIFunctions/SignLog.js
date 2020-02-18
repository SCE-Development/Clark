import axios from 'axios'
import { ApiResponse } from './ApiResponses'

/**
 * Retrieve all signs.
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function getAllSignLogs () {
  const result = new ApiResponse()
  await axios
    .get('api/SignLog/getSignLogs')
    .then(res => {
      result.responseData = res.data
    })
    .catch(err => {
      result.error = true
      result.responseData = err
    })
  return result
}

/**
 * Add a sign logs.
 * @param {Object} newSign - The sign that is to be added
 * @param {string|undefined} newSign.firstName - The first name of the user who posted the sign
 * @param {string|undefined} newSign.timeOfPosting- The time the sign was posted
 * @param {string} newSign.signTitle - The sign that was posted
 * @param {(string)} newSign.email - The email of the person that posted the sign
 */
export async function addSignLog (newSign) {
  const result = new ApiResponse()
  await axios.post('api/SignLog/addSignLog', { ...newSign }).catch(err => {
    result.error = true
    result.responseData = err
  })
  return result
}
