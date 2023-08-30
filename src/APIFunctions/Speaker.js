import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';

export async function addUrl(url, user, token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/url',
      {url, user, token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getQueued() {
  let status = new ApiResponse();
  await axios
    .get(PERIPHERAL_API_URL + '/Speaker/queued')
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
