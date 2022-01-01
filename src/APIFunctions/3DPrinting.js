import axios from 'axios';
import { ApiResponse } from './ApiResponses';
let config = require('../config/config.json');
let GENERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.GENERAL_API_URL_PROD : config.GENERAL_API_URL;

/**
 * Submit a user's print request.
 * @param {Object} printRequest - The request containing all of the project's
 * information.
 * @param {string} printRequest.name - The full name of the user.
 * @param {string} printRequest.color - The user's preferred color of the
 * print.
 * @param {string} printRequest.comment - Any comments left on the request.
 * @param {string} printRequest.contact - An email to contact the user with.
 * @param {string} printRequest.projectType - e.g. Personal, School.
 * @param {string} printRequest.url - e.g. URL to the print file.
 * @param {string} printRequest.email - Any comments left on the request.
 * @returns {ApiResponse} - Containing any error information
 *                          related to the request.
 */
export async function submit3DPrintRequest(printRequest) {
  let status = new ApiResponse();
  const {
    name,
    color,
    comment,
    contact,
    projectType,
    url,
    email
  } = printRequest;
  await axios
    .post(GENERAL_API_URL + '/3DPrintingForm/submit', {
      name,
      color,
      comment,
      contact,
      projectType,
      url,
      progress: 'Pending',
      email
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Query the database for all 3D print requests.
 * @returns {ApiResponse} Containing any error information related to the
 * request or list of requests
 */
export async function getAll3DPrintRequests() {
  let status = new ApiResponse();
  await axios
    .post(GENERAL_API_URL + '/3DPrintingForm/GetForm', {})
    .then(result => {
      status.responseData = result.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

/**
 * Delete a specified 3D print request by it's date and email.
 * @param {Object} requestToDelete - The request containing all of the
 * project's information.
 * @param {string} requestToDelete.date - The date the request was created.
 * @param {string} requestToDelete.email - The requesting user's email.
 * @param {string} token - The user's authentication token.
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function delete3DPrintRequest(requestToDelete, token) {
  let status = new ApiResponse();
  const { date, email } = requestToDelete;
  await axios.post(GENERAL_API_URL + '/3DPrintingForm/delete', {
    token,
    date,
    email
  })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Update a specified 3D print request by it's date and email.
 * @param {Object} requestToUpdate - The request containing all of the
 * project's information.
 * @param {string} requestToUpdate.date - The date the request was created.
 * @param {string} requestToUpdate.email - The requesting user's email.
 * @param {string} token - The user's authentication token.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the search result
 */
export async function update3DPrintRequestProgress(requestToUpdate, token) {
  let status = new ApiResponse();
  const { date, email, progress } = requestToUpdate;
  await axios
    .post(GENERAL_API_URL + '/3DPrintingForm/edit', {
      date,
      email,
      progress,
      token
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Search a specified 3D print request by it's email.
 * @param {string} email - The requesting user's email.
 * @returns {ApiResponse} - If the request was sucessfully,
 *                          return array of requests.
 */
export async function search3DPrintRequests(email) {
  let status = new ApiResponse();
  await axios
    .post(GENERAL_API_URL + '/3DPrintingForm/GetForm', {
      email
    })
    .then(result => {
      status.responseData = result.data;
    })
    .catch(() => {
      status.err = true;
    });
  return status;
}
