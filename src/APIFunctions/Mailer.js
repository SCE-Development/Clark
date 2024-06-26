import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let MAILER_API_URL = process.env.REACT_APP_MAILER_API_URL
  || 'http://localhost:8082/cloudapi';

let GENERAL_API_URL = process.env.REACT_APP_GENERAL_API_URL
  || 'http://localhost:8080/api';

/**
 * Invoke the gmail API to send an email to verify a user.
 * @param {string} email - The user's email
 * @param {string} firstName - The user's first name
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendVerificationEmail(email, token) {
  let status = new ApiResponse();
  await axios
    .post(GENERAL_API_URL + '/Auth/resendVerificationEmail', {
      email,
      token,
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
 * Invoke the gmail API to send an email to password reset a user.
 * @param {string} email - The user's email
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendPasswordReset(email, captchaToken) {
  let status = new ApiResponse();
  await axios
    .post(GENERAL_API_URL + '/Auth/sendPasswordReset', {
      email,
      captchaToken,
    })
    .then((response) => {
      status.responseData = response;
    })
    .catch((error) => {
      status.error = error;
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
    .post(MAILER_API_URL + '/Mailer/sendBlastEmail', {
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
