import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';


export async function queued(token) {
  let status = new ApiResponse();
  const url = new URL('/peripheralapi/Speaker/queued', BASE_API_URL);
  await axios
    .get(url.href, { params: { token } })
    .then(res => {
      status.responseData = res.data.queue;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function addUrl(urlToAdd, token) {
  let status = new ApiResponse();
  const url = new URL('/peripheralapi/Speaker/stream', BASE_API_URL);
  await axios
    .post(url.href, {token, url: urlToAdd})
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
  const url = new URL('/peripheralapi/Speaker/skip');
  await axios
    .post(url.href, {token})
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
  const url = new URL('/peripheralapi/Speaker/pause');
  await axios
    .post(url.href, {token})
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
  const url = new URL('/peripheralapi/Speaker/resume');
  await axios
    .post(url.href, {token})
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
