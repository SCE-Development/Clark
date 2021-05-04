import axios from 'axios';
import { ApiResponse } from './ApiResponses';

/**
 * Gets the temporary user from the cache when given the id
 * @param {integer} id - the id associated with the temporary user in the cache
 * @returns {ApiResponse} - Containing any error information
 *                      related to the request or the temporary user
 */
export async function getTempUser(id) {
  let status = new ApiResponse();
  await axios
    .post('http://localhost:8080/api/verifiedUser/getTempUser', {id})
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Adds the user associated with the information in body to the database
 * @param {Object} body - contains the discord ID and google token of the user
 * @returns {ApiResponse} - Containing any error information
 *                          related to the request.
 */
export async function addUser(body) {
  let status = new ApiResponse();
  await axios
    .post('http://localhost:8080/api/verifiedUser/addUser_withGoogleToken'
      , body)
    .catch(() => {
      status.error = true;
    });
  return status;
}
