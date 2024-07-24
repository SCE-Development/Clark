import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let GENERAL_API_URL = 'http://localhost:8080/api';

export async function getAdsFromApi() {
  let status = new ApiResponse();
  await axios.get(GENERAL_API_URL + '/Advertisement/getAllAdvertisements')
    .then(res => {
      status.responseData = res.data;
    }).catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
