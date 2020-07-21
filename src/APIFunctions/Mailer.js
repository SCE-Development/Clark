import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { MAILER_API_URL } from '../config/config.json';

/**
 * Invoke the gmail API to send an email to verify a user.
 * @param {string} email - The user's email
 * @param {string} firstName - The user's first name
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendVerificationEmail(email, firstName) {
  let status = new ApiResponse();
  await axios
    .post(MAILER_API_URL + '/api/Mailer/sendVerificationEmail', {
      recipientEmail: email,
      recipientName: firstName,
    })
    .then((response) => {
      status.responseData = response;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}

/**
 * Invoke the gmail API to send an email blast to specified users.
 * @param {Array} emailList - String array of user email addresses
 * @param {string} subject - The subject of the email
 * @param {string} content - The contents of the email
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendBlastEmail(emailList, subject, content) {
  let status = new ApiResponse();
  await axios
    .post(MAILER_API_URL + '/api/Mailer/sendBlastEmail', {
      emailList,
      subject,
      content,
    })
    .then((response) => {
      status.responseData = response;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}

/**
 * Add a new event.
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
 * request or the response data
 */
export async function addEventToCalendar(newEvent, token) {
  let status = new ApiResponse();
  const firstAPI = axios.create({
    baseURL: MAILER_API_URL
  });
  await firstAPI
    .post('api/Calendar/addEventToCalendar', { token, newEvent })
    .then(res => {
      status.responseData = res.data;
    })
    .catch((error) => {
      status.error = true;
    });
  return status;
}
