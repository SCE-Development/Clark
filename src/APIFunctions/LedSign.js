import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { RPC_API_URL, LOGGING_API_URL } from '../config/config.json';

/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function healthCheck(officerName) {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/LedSign/healthCheck', { officerName })
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
 * Deletes a certain message from a certain index.
 * @param {string} deleteMessage The text of the message to be deleted.
 * @returns {ApiResponse} ApiResponse Object containing the response data
 */
export async function deleteMessageFromQueue(deleteMessage) {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/SceRpcApi/LedSign/deleteMessageFromQueue',
      { deleteMessage })
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
 * Retrieve all sign logs.
 * @returns {ApiResponse} Containing any error information related to the
 * request.
 */
export async function getAllSignLogs() {
  let result = new ApiResponse();
  await axios
    .get(LOGGING_API_URL+'/SignLog/getSignLogs')
    .then(res => {
      result.responseData = res.data;
    })
    .catch(err => {
      result.responseData = err;
      result.error = true;
    });
  return result;
}

/**
 * Update the text of the sign.
 * @param {Object} signData - An object containing all of the sign data (text,
 * colors, etc.) sent to the RPC client.
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function addMessageToQueue(signData) {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/SceRpcApi/LedSign/addMessageToQueue', { ...signData })
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

/**
 * Clears all messages from the queue.
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function clearMessageQueue() {
  let status = new ApiResponse();
  await axios
    .post(RPC_API_URL + '/SceRpcApi/LedSign/clearMessageQueue')
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
