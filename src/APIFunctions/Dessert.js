import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let config = require('../config/config.json');
let GENERAL_API_URL = process.env.NODE_ENV === 'production' ?
  config.GENERAL_API_URL_PROD : config.GENERAL_API_URL;


/**
 * Retrieve all events.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of events
 */
export async function getAllEvents() {
  let status = new ApiResponse();
  await axios
    .get(GENERAL_API_URL+'/Dessert/getDesserts')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

