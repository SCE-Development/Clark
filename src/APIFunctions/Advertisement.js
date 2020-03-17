import axios from 'axios';
import { ApiResponse } from './ApiResponses';

/**
 * Retrieve all Advertisement.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of Advertisement
 */
export async function getAllAdvertisement() {
  let status = new ApiResponse();
  await axios
    .get('api/Advertisement/getAdvertisement')
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
 * Add a new advertisement.
\ * @param {string} newAdvertisement.advertisementCreateDate -
The start date of the new Advertisement
\ * @param {string} newAdvertisement.advertisementExpireDate -
The end date of the new advertisement
 * @param {(string|undefined)} newAdvertisement.imageUrl -
 A URL of the image of the
 * Advertisement
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function createNewAdvertisement(newAdvertisement, token) {
  let status = new ApiResponse();
  const advertisementToAdd = {
    createDate: newAdvertisement.advertisementCreateDate,
    expireDate: newAdvertisement.advertisementExpireDate,
    imageURL: newadvertisement.imageUrl
  };
  await axios
    .post('api/Advertisement/createAdvertisement',
      { token, ...advertisementToAdd })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * edit an advertisement.
 * @param {Object} advertisementToUpdate -
 The advertisement that is to be updated
 * @param {string} advertisementToUpdate._id -
 The unique MongoDB id of the advertisement
 * @param {(string|undefined)} advertisementToUpdate.advertisementCreateDate -
 The updated date of
 * the advertisement
 * @param {(string|undefined)} advertisementToUpdate.advertisementExpireDate -
 The updated date of
 * the advertisement
 * @param {(string|undefined)} advertisementToUpdate.imageURL -
 An updated image URL of
 * the advertisement
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */

export async function editadvertisement(advertisementToUpdate, token) {
  let status = new ApiResponse();
  const advertisementToEdit = {
    id: advertisementToUpdate._id,

    createDate: advertisementToUpdate.advertisementCreateDate,
    expireDate: advertisementToUpdate.advertisementExpireDate,
    imageURL: advertisementToUpdate.imageURL
  };
  await axios
    .post('api/Advertisement/editadvertisement',
      { token, ...advertisementToEdit })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}
/**
 * Add a new advertisement.
 * @param {Object} advertisementToDelete - The advertisement that is to be added
 * @param {string} advertisementToDelete._id - The unique MongoDB
 *                                     id of the advertisement that is to
 * be added
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function deleteAdvertisement(advertisementToDelete, token) {
  let status = new ApiResponse();
  await axios
    .post('/api/Advertisement/deleteAdvertisement',
      { token, id: advertisementToDelete._id })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
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
