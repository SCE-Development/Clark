import axios from 'axios';
import { apiUrl } from '../config/config';
import { UserApiResponse } from './ApiResponses';

/**
 * Queries the database for all users.
 * @param {string} token The jwt token for verification
 * @returns {UserApiResponse} Containing any error information or the array of
 * users.
 */
export async function getAllUsers(token) {
  let status = new UserApiResponse();
  await axios
    // get all user!
    .post(`${apiUrl}/api/user/users`, {
      // don't need email
      token
    })
    .then(result => {
      status.responseData = result.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Checks if the user is signed in by evaluating a jwt token in local storage.
 * @returns {UserApiResponse} Containing information for
 *                            whether the user is signed
 * in or not
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
    .post(`${apiUrl}/api/user/verify`, { token })
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
    .post(`${apiUrl}/api/user/register`, {
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
 * Updates the user's last login date when they log in.
 * @param {string} email The email of the user
 * @param {string} token The JWT token to allow the user to be edited
 */
async function updateLastLoginDate(email, token) {
  await editUser({ email, lastLogin: Date.now() }, token);
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
    .post(`${apiUrl}/api/user/login`, { email, password })
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
 * Edit an existing users
 * @param {Object} userToEdit - The user that is to be updated
 * @param {(string|undefined)} userToEdit.firstName - The updated first name of
 * the user
 * @param {(string|undefined)} userToEdit.lastName - The updated last name of
 * the user
 * @param {string} userToEdit.email - Used to find the specific user to update
 * @param {(string|undefined)} userToEdit.password - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.major - The updated major of
 * the user
 * @param {(string|undefined)} userToEdit.numberOfSemestersToSignUpFor
 * @param {(string|undefined)} userToEdit.doorCode - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.pagesPrinted - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.accessLevel - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.lastLogin - The updated password of
 * the user
 * @param {string} token - The jwt token for authentication
 * @returns {UserApiResponse} containing if the search was successful
 */
export async function editUser(userToEdit, token) {
  let status = new UserApiResponse();
  const {
    firstName,
    lastName,
    email,
    password,
    major,
    numberOfSemestersToSignUpFor,
    doorCode,
    pagesPrinted,
    accessLevel,
    lastLogin
  } = userToEdit;
  await axios
    .post(`${apiUrl}/api/user/edit`, {
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor,
      doorCode,
      pagesPrinted,
      accessLevel,
      lastLogin,
      token
    })
    .then(result => {
      status.responseData = result.data;
    })
    .catch(err => {
      status.error = true;
      status.responseData = err.response;
    });
  return status;
}

/**
 * Deletes a user by an email
 * @param {string} email The email of the user to delete
 * @param {string} token jwt token to authorize deletion
 * @returns {UserApiResponse} containing if the search was successful
 */
export async function deleteUserByEmail(email, token) {
  let status = new UserApiResponse();
  axios
    .post(`${apiUrl}/api/user/delete`, {
      token,
      email
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Finds a user by a specific email
 * @param {string} email the email to search a user by
 * @param {string} token the jwt token to authorize the search
 * @returns {UserApiResponse} containing if the search was successful and the
 * data of a user if found.
 */
export async function searchUserByEmail(email, token) {
  let status = new UserApiResponse();
  await axios
    .post(`${apiUrl}/api/user/search`, {
      token,
      email
    })
    .then(result => {
      status.responseData = result.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * This function checks the user database to see if a given email already
 * exists or not.
 * @param {string} email The email value to check
 * @returns {UserApiResponse} containing if the search was successful
 */
export async function checkIfUserExists(email) {
  let status = new UserApiResponse();
  await axios.post(`${apiUrl}/api/user/checkIfUserExists`, { email })
    .catch(() => {
      status.error = true;
    });
  return status;
}
