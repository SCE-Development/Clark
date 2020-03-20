import axios from 'axios';
import { ApiResponse } from './ApiResponses';

/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function healthCheck(officerName) {
  let status = new ApiResponse();
  await axios
    .post('api/LedSign/healthCheck', { officerName })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

/**
 * Retrieve all sign logs.
 * @returns {ApiResponse} Containing any error information related to the
 * request.
 */
export async function getAllSignLogs() {
  let result = new ApiResponse();
  await axios
    .get('api/LedSign/getSignLogs')
    .then(res => {
      result.responseData = res.data;
    })
    .catch(err => {
      result.responseData = err;
      result.error = true;
    });
  return result;
}

/**
 * Add a new sign log.
 * @param {Object} newEvent - The event that is to be added
 * @param {string} newEvent.title - The title of the new event
 * @param {(string|undefined)} newEvent.description - The description of the
 * new event
 * @param {string} newEvent.eventLocation - The location of the new event
 * @param {string} newEvent.eventDate - The late of the new event
 * @param {string} newEvent.startTime - The start time of the new event
 * @param {string} newEvent.endTime - The end time of the new event
 * @param {(string|undefined)} newEvent.eventCategory - The category of the new
 * event
 * @param {(string|undefined)} newEvent.imageURL - A URL of the image of the
 * event
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function updateSignText(signData) {
  let status = new ApiResponse();
  await axios
    .post('api/LedSign/updateSignText', { ...signData })
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
