import axios from 'axios';
import { ApiResponse } from './ApiResponses';

/**
 * Retrieve all doorcodes.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of doorcodes
 */
export async function getAllDoorCodes() {
  let status = new ApiResponse();
  await axios
    .get('api/DoorCode/getDoorCodes')
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
 * Retrieve one available doorcode.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of doorcodes
 */
export async function getOneAvailableDoorCode() {
  let status = new ApiResponse();
  await axios
    .get('api/DoorCode/getAvailableDoorCode')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getPersonsDoorCode(emailLook, token) {
  let status = new ApiResponse();
  const emailToLook = {
    email: emailLook,
  };
  await axios
    .post('api/DoorCode/getPersonsDoorCode', { token, ...emailToLook })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Add a new door code.
 * @param {Object} newDoorCode - The door code that is to be added
 * @param {string} newDoorCode.doorCode - The door code sequence
 * @param {string} newDoorCode.doorCodeValidUntil - The last date door code
 * is valid for
 * @param {number} newDoorCode.userEmails - emails of the users
 * @param {string} token - The door code's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function createNewDoorCode(newDoorCode, token) {
  let status = new ApiResponse();
  const doorCodeToAdd = {
    doorCode: newDoorCode.doorCode,
    doorCodeValidUntil: newDoorCode.doorCodeValidUntil,
    userEmails: newDoorCode.userEmails,
  };
  await axios
    .post('api/DoorCode/addCode', { token, ...doorCodeToAdd })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Edit a door code.
 * @param {Object} doorCodeToUpdate - The door code that is to be updated
 * @param {string} doorCodeToUpdate._id - The unique MongoDB id of the door code
 * @param {(string|undefined)} doorCodeToUpdate.doorCode - The updated door code
 * sequence
 * @param {(string|undefined)} doorCodeToUpdate.doorCodeValidUntil - The updated
 * last date for door code to be valid
 * @param {(number|undefined)} doorCodeToUpdate.userEmails - updated emails
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function editDoorCode(doorCodeToUpdate, token) {
  let status = new ApiResponse();
  const doorCodeToEdit = {
    id: doorCodeToUpdate._id,
    doorCode: doorCodeToUpdate.doorCode,
    doorCodeValidUntil: doorCodeToUpdate.doorCodeValidUntil,
    userEmails: doorCodeToUpdate.userEmails,
  };
  await axios
    .post('api/DoorCode/editCode', { token, ...doorCodeToEdit })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Delete a door code
 * @param {Object} doorCodeToDelete - The door code that is to be deleted
 * @param {string} doorCodeToDelete._id - The unique MongoDB
 *                                     id of the door code that is to
 * be deleted
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function deleteDoorCode(doorCodeToDelete, token) {
  let status = new ApiResponse();
  await axios
    .post('/api/DoorCode/removeCode', { token, id: doorCodeToDelete._id })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Edit a door code.
 * @param {Object} doorCodeToUpdate - The door code that is to be updated
 * @param {string} doorCodeToUpdate._id - The unique MongoDB id of the door code
 * @param {(string|undefined)} doorCodeToUpdate.doorCode - The updated door code
 * sequence
 * @param {(string|undefined)} doorCodeToUpdate.doorCodeValidUntil - The updated
 * last date for door code to be valid
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function assignDoorCode(email, token) {
  let status = new ApiResponse();
  const doorCode = await getOneAvailableDoorCode();
  if(doorCode.error) {
    status.error = true;
    return status;
  }
  doorCode.responseData.userEmails.push(email);
  const doorCodeEdit = await editDoorCode(doorCode.responseData, token);
  status.responseData = doorCodeEdit.responseData;
  return status;
}

export async function removePersonsDoorCode(email, token) {
  let status = new ApiResponse();
  const doorCode = await getPersonsDoorCode(email, token);
  if(doorCode.error) {
    status.error = true;
    return status;
  }
  // remove the email from the userEmails array in doorCode
  const index = doorCode.responseData.doorCode.userEmails.indexOf(email);
  if (index > -1) {
    doorCode.responseData.doorCode.userEmails.splice(index, 1);
  }
  const doorCodeEdit = await editDoorCode(doorCode.responseData.doorCode,
    token);
  status.responseData = doorCodeEdit.responseData;
  return status;
}

/**
 * Format a given string to be rendered in an input of type date
 * @param {string} unformattedDate A date separated by slashes e.g. 02/28/1992
 * @returns {string} A formatted date with dashes e.g. 1992-02-28
 */
export function getDateWithDashes(unformattedDate) {
  if (!unformattedDate) return;
  const [month, day, year] = unformattedDate.split('/');
  return [year, month, day].join('-');
}

/**
 * Format a given string to be rendered in an input of type date
 * @param {string} unformattedDate A date separated by dashes e.g. 1992-02-28
 * @returns {string} A formatted date with slashes e.g. 02/28/1992
 */
export function getDateWithSlashes(unformattedDate) {
  if (!unformattedDate) return;
  const [year, month, day] = unformattedDate.split('-');
  return [month, day, year].join('/');
}
