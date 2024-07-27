import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let GENERAL_API_URL = 'http://localhost:8080/api';

export async function getAd() {
  let status = new ApiResponse();
  await axios.get(GENERAL_API_URL + '/Advertisement/getAdvertisements')
    .then(res => {
      status.responseData = res.data;
    });
  return status;
}
