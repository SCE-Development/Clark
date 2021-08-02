import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import dataAPI from './CountAPI'; 

let config = require('../config/config.json');
let MAILER_API_URL = process.env.NODE_ENV === 'production' ?
  config.MAILER_API_URL_PROD : config.MAILER_API_URL;

/**
 * Invokes the google spreadsheet API to add officer application form data to it
 * @param {object} row - the data from the officer application form
 * @param {String} sheetsId - ID of the google sheet getting updated
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function addToSpreadsheet(row, sheetsId){
  let status = new ApiResponse();
  await axios
    .post(MAILER_API_URL + '/sheets/addToSpreadsheet',
      {row, sheetsId})
    .then((res)=>{
      status.responseData = res;
      status.error = false;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });

  if (status.error = true) {
    dataAPI('addToSpreadsheet', true);
  }
  else {
    dataAPI('addToSpreadsheet', false);
  }
  return status;
}
