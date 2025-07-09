import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let CARD_READER_URL = 'http://localhost:8080/api';

export async function getAllCards() {
  let status = new ApiResponse();
  await axios
    .get(CARD_READER_URL + '/OfficeAccessCard/getCardData')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });

  return status;
}