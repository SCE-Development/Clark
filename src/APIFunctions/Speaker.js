import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';


console.debug(PERIPHERAL_API_URL);

export async function addUrl(url) {
  let status = new ApiResponse();
  console.debug(url);
  await axios
    .post(PERIPHERAL_API_URL + `/Speaker/stream?url=${url}`)
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      console.debug(err);
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function skip(url) {
  let status = new ApiResponse();
  console.debug(url);
  await axios
    .post(PERIPHERAL_API_URL + `/Speaker/skip`)
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      console.debug(err);
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function pause() {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/pause')
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function resume() {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/resume')
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
      status = res
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
