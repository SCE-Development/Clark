import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let PERIPHERAL_API_URL = process.env.REACT_APP_PERIPHERAL_API_URL
  || 'http://localhost:8081/peripheralapi';


export async function queued(token) {
  let status = new ApiResponse();
  await axios
    .get(PERIPHERAL_API_URL + '/Speaker/queued', { params: { token } })
    .then(res => {
      status.responseData = res.data.queue;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function addUrl(url, token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/stream', {token, url})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function skip(token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/skip', {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function rewind(token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/rewind', {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function forward(token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/forward', {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function pause(token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/pause', {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function resume(token) {
  let status = new ApiResponse();
  await axios
    .post(PERIPHERAL_API_URL + '/Speaker/resume', {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
