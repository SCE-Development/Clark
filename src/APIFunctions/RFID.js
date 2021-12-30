import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let config = require('../config/config.json');
let PERIPHERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.PERIPHERAL_API_URL_PROD : config.PERIPHERAL_API_URL;

/**
 * Retrieve all events.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of events
 */
export async function getAllRFIDs() {
  let status = new ApiResponse();
  await axios
    .get(PERIPHERAL_API_URL+'/RFID/getRFIDs')
    .then(res => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

/**
 * Changes the state of the ESP32
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function createNewRFID() {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL+'/RFID/createRFID', { token, ...RFIDtoAdd })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Reads RFID.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function readNewRFID(readRFIDByte, token) {
  let status = new ApiResponse();
  await axios
    .get(RFID_API_URL + '/RFID/validateRFID')
    .then((res) => {
      status.responseData = res.data;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

/**
 * Delete a RFID.
 * @param {Object} RFIDToDelete - The RFID that is to be added
 * @param {string} RFIDToDelete._id - The unique MongoDB id of
 *                                    the RFID that is to be added
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function deleteEvent(eventToDelete, token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL+'/RFID/deleteRFID',
      { token, _id: eventToDelete._id })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}
