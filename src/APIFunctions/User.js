import axios from 'axios';
import { UserApiResponse } from './ApiResponses';
import { membershipState, userFilterType } from '../Enums';

let GENERAL_API_URL = process.env.REACT_APP_GENERAL_API_URL
  || 'http://localhost:8080/api';

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
    .post(GENERAL_API_URL + '/User/users', {
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

export async function getCountAllUsers(query) {
  let status = new UserApiResponse();
  await axios
    .get(GENERAL_API_URL + `/User/countAllUsers/${query}`)
    .then(result => {
      status.responseData = result.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

export async function getCurrentUsers(query) {
  let status = new UserApiResponse();
  await axios
    .get(GENERAL_API_URL + `/User/currentUsers/${query}`)
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
 * @param {(string|undefined)} userToEdit._id - MongoDB id of the user
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
 * @param {(string|undefined)} userToEdit.emailVerified - If the user's email
 * was verified
 * @param {(string|undefined)} userToEdit.emailOptIn - Opt into SCE's blast
 * week emails
 * @param {string} token - The jwt token for authentication
 * @returns {UserApiResponse} containing if the search was successful
 */
export async function editUser(userToEdit, token) {
  let status = new UserApiResponse();
  const {
    _id,
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
    emailVerified,
    emailOptIn,
  } = userToEdit;
  await axios
    .post(GENERAL_API_URL + '/User/edit', {
      _id,
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
      emailVerified,
      emailOptIn,
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
    .post(GENERAL_API_URL + '/User/delete', {
      token,
      email
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
  await axios.post(GENERAL_API_URL + '/User/checkIfUserExists',
    { email }).catch(() => {
    status.error = true;
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
  await axios.post(GENERAL_API_URL + '/user/connectToDiscord', { email, token })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

export async function getUserById(userID, token) {
  let status = new UserApiResponse();
  await axios.post(GENERAL_API_URL + '/user/getUserById', {userID, token})
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.error = true;
    });
  return status;
}

export async function isUserSubscribed(email) {
  let status = new UserApiResponse();
  await axios
    .get(GENERAL_API_URL + `/user/isUserSubscribed?=email${email}`)
    .then((result) => {
      status.responseData = result.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

export async function setUserEmailPreference(email, emailOptIn) {
  let status = new UserApiResponse();
  await axios
    .post(GENERAL_API_URL + '/user/setUserEmailPreference', {
      email,
      emailOptIn,
    })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.error = true;
    });
  return status;
}

export async function getUserData(email) {
  let status = new UserApiResponse();
  await axios
    .post(GENERAL_API_URL + '/user/getUserDataByEmail', {
      email,
    })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.error = true;
    });
  return status;
}

export async function getAllUserSubscribedAndVerified(token) {
  let status = new UserApiResponse();
  await axios
    .post(GENERAL_API_URL + '/user/usersSubscribedAndVerified', { token })
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.error = true;
    });
  return status;
}
