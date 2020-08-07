import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { MAILER_API_URL } from '../config/config.json';

/**
 * Invokes the google spreadsheet API to add officer application form data to it
 * @param {object} row - the data from the officer application form
 * @param {String} sheetsId - ID of the google sheet getting updated
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function addToSpreadsheet(row, sheetsId) {
  let status = new ApiResponse();
  await axios
    .post(MAILER_API_URL + '/api/sheets/addToSpreadsheet', { row, sheetsId })
    .then((res) => {
      status.responseData = res;
      status.error = false;
    })
    .catch((err) => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
