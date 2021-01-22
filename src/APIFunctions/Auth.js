import axios from 'axios';
import { UserApiResponse, ApiResponse } from './ApiResponses';
import { updateLastLoginDate } from './User';

let config = require('../config/config.json');
let GENERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.GENERAL_API_URL_PROD : config.GENERAL_API_URL;

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
    numberOfSemestersToSignUpFor
  } = userToRegister;
  await axios
    .post(GENERAL_API_URL+'/Auth/register', {
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor
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
  await axios
    .post(GENERAL_API_URL+'/Auth/login', { email, password })
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

  await axios
    .post(GENERAL_API_URL+'/Auth/verify', { token })
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
  await axios
    .post(GENERAL_API_URL+'/Auth/validateVerificationEmail', {
      email,
      hashedId
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
