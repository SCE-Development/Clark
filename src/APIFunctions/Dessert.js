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

/**
 * Handles the case in which the image URL is not valid
 * @param {string} url an image url to be added to an event
 */
function handleImageURL(url) {
  if(url !== null) {
    return url;
  }
  return 'https://i.gyazo.com/640f22609f95f72a28afa0a130e557a1.png';
}

export function getDateWithSlashes(unformattedDate) {
  if (!unformattedDate) return;
  const [year, month, day] = unformattedDate.split('-');
  return [month, day, year].join('/');
}
