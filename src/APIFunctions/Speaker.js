import axios from 'axios';
import { ApiResponse } from './ApiResponses';

const config  = require('../config/config.json');
const speakerPort = config.speakerPort;

let SPEAKER_API_URL = `http://localhost:${speakerPort}`;

export async function addUrl(url) {
  let status = new ApiResponse();
  await axios
    .get(SPEAKER_API_URL + `/stream/?url=${url}`)
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function pause() {
  let status = new ApiResponse();
  await axios
    .get(SPEAKER_API_URL + '/pause')
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
    .get(SPEAKER_API_URL + '/resume')
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
    .get(SPEAKER_API_URL + '/queued')
    .then(res => {
      status = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
