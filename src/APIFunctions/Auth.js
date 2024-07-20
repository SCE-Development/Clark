import axios from 'axios';
import { UserApiResponse, ApiResponse } from './ApiResponses';
import { updateLastLoginDate } from './User';
import { BASE_API_URL } from '../Enums';


/**
 * Add a new user to the database.
 * @param {Object} userToRegister - The object containing all of the user's
 * information
 * @param {(string|undefined)} userToRegister.firstName
 * @param {(string|undefined)} userToRegister.lastName
 * @param {(string|undefined)} userToRegister.email
 * @param {(string|undefined)} userToRegister.password - This is hashed in the
 * frontend
 * @param {(string|undefined)} userToRegister.major
 * @param {(string|undefined)} userToRegister.numberOfSemestersToSignUpFor
 * @returns {UserApiResponse} containing if the search
 *                            was successful or error data
 */
export async function registerUser(userToRegister) {
  let status = new UserApiResponse();
  const {
    firstName,
    lastName,
    email,
    password,
    major,
    numberOfSemestersToSignUpFor,
    captchaToken
  } = userToRegister;
  const url = new URL('/Auth/register', BASE_API_URL);
  await axios
    .post(url.href, {
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor,
      captchaToken
    })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err.response;
    });
  return status;
}

/**
 * Logs in the user with their email and password. Also updates the last login
 * date for the user.
 * @param {string} email The email of the user
 * @param {string} password The password of the user
 * @returns {UserApiResponse} Contains the generated JWT token or any error data
 */
export async function loginUser(email, password) {
  let status = new UserApiResponse();
  const url = new URL('/api/Auth/login', BASE_API_URL);
  await axios
    .post(url.href, { email, password })
    .then(async result => {
      status.token = result.data.token;
      await updateLastLoginDate(email, result.data.token);
      window.location.reload();
    })
    .catch(error => {
      status.error = true;
      status.responseData = error.response;
    });
  return status;
}

/**
 * Checks if the user is signed in by evaluating a jwt token in local storage.
 * @returns {UserApiResponse} Containing information for
 * whether the user is signed or not
 */
export async function checkIfUserIsSignedIn() {
  let status = new UserApiResponse();

  const token = window.localStorage
    ? window.localStorage.getItem('jwtToken')
    : '';

  // If there is not token in local storage,
  // we cant do anything and return
  if (!token) {
    status.error = true;
    return status;
  }

  const url = new URL('/api/Auth/verify', BASE_API_URL);
  await axios
    .post(url.href, {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      status.responseData = res.data;
      status.token = token;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err;
    });
  return status;
}

/**
 * Verify a user's email after the visiting the link sent to their email.
 * @param {string} email - The user's email
 * @param {string} hashedId - A hashed value of the user's mongoDB _id field
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function validateVerificationEmail(email, hashedId) {
  let status = new ApiResponse();
  const url = new URL('/api/Auth/validateVerificationEmail', BASE_API_URL);
  await axios
    .post(url.href, {
      email,
      hashedId
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

/**
 * Reset a user's password after the visiting the link sent to their email.
 * @param {string} hashedId - A hashed value of the user's mongoDB _id field
 * @param {string} password - The user's password
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function resetPassword(password, hashedId, resetToken) {
  let status = new ApiResponse();
  const url = new URL('/api/Auth/resetPassword', BASE_API_URL);
  await axios
    .post(url.href, {
      password,
      hashedId,
      resetToken
    })
    .catch(err => {
      status.error = err;
      status.responseData = err.response;
    });
  return status;
}

export async function validatePasswordReset(resetToken) {
  let status = new ApiResponse();
  const url = new URL('/api/Auth/validatePasswordReset', BASE_API_URL);
  await axios
    .post(url.href, { resetToken })
    .catch(err => {
      status.error = true;
      status.responseData = err.response;
    });
  return status;
}
