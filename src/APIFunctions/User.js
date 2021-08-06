import axios from 'axios';
import { UserApiResponse } from './ApiResponses';
import { membershipState, userFilterType } from '../Enums';

let config = require('../config/config.json');
let GENERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.GENERAL_API_URL_PROD : config.GENERAL_API_URL;

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
    .post(GENERAL_API_URL+'/User/users', {
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
 * @param {(string|undefined)} userToEdit.discordUsername
 * @param {(string|undefined)} userToEdit.discordDiscrim
 * @param {(string|undefined)} userToEdit.discordID
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
    discordUsername,
    discordDiscrim,
    discordID,
    pagesPrinted,
    accessLevel,
    lastLogin
  } = userToEdit;
  await axios
    .post(GENERAL_API_URL+'/User/edit', {
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor,
      doorCode,
      discordUsername,
      discordDiscrim,
      discordID,
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
 * Updates the user's last login date when they log in.
 * @param {string} email The email of the user
 * @param {string} token The JWT token to allow the user to be edited
 */
export async function updateLastLoginDate(email, token) {
  await editUser({ email, lastLogin: Date.now() }, token);
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
    .post(GENERAL_API_URL+'/User/delete', {
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
    .post(GENERAL_API_URL+'/User/search', {
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
  await axios.post(GENERAL_API_URL+'/User/checkIfUserExists',
    { email }).catch(() => {
    status.error = true;
  });
  return status;
}

export async function getUserID(email) {
  let status = new UserApiResponse();
  await axios.post(GENERAL_API_URL+'/User/getUserID',
    { email })
    .then(result => {
      status.responseData = result.data;
    })
    .catch((error) => {
      status.error = true;
      status.responseData = error;
    });
  return status;
}

/**
 * This function takes in a list of current users and returns a
 * filtered user list that is determined by the filter id.
 * @param {array} users array of all registered users
 * @param {integer} filterID represents what to filter email by
 * @returns {array} filtered array of users
 */
export function filterUsers(users, filterID) {
  let filteredUsers = users.filter((user) => {
    if (filterID === userFilterType.VALID) {
      return (user.accessLevel >= membershipState.ALUMNI);
    } else if (filterID === userFilterType.NON_VALID) {
      return (
        user.accessLevel === membershipState.NON_MEMBER ||
        user.accessLevel === membershipState.PENDING
      );
    } else {
      return true;
    }
  });
  return filteredUsers;
}

export async function connectToDiscord(email, token) {
  let status = new UserApiResponse();
  await axios.post(GENERAL_API_URL+'/user/connectToDiscord', { email, token })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

