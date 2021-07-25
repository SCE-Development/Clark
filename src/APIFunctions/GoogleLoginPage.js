import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import dataAPI from './CountAPI'; 

let config = require('../config/config.json');
let DISCORD_SJSU_API_URL = process.env.NODE_ENV === 'production' ?
  config.DISCORD_SJSU_API_URL_PROD : config.DISCORD_SJSU_API_URL;

/**
 * Gets the temporary user from the cache when given the id
 * @param {string} email - sjsu email to query
 * @returns {ApiResponse} - Containing any error information
 *                      related to the request or the temporary user
 */
export async function getVerifiedUser(email) {
  let status = new ApiResponse();
  await axios
    .post(`${DISCORD_SJSU_API_URL}/VerifiedUser/getUser`, { email })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Gets the temporary user from the cache when given the id
 * @param {integer} id - the id associated with the temporary user in the cache
 * @returns {ApiResponse} - Containing any error information
 *                      related to the request or the temporary user
 */
export async function getTempUser(id) {
  let status = new ApiResponse();
  await axios
    .get(`${DISCORD_SJSU_API_URL}/TempUser/get_tempUser/${id}`)
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
    .post(`${DISCORD_SJSU_API_URL}/verifiedUser/addUser_withGoogleToken`
      , body)
    .catch(() => {
      status.error = true;
    });
  return status;
}
