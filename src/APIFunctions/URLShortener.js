import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let URL_SHORTENER_URL = 'http://localhost:8080/api';

export async function getAllURLs(token) {
  let status = new ApiResponse();
  await axios
    .get(URL_SHORTENER_URL + '/URLShortener-Endpoints/listAll', {
      params: { token }
    })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createURL(url, alias = null, token) {
  let status = new ApiResponse();
  const URLToAdd = { url, alias };
  await axios
    .post(URL_SHORTENER_URL + '/URLShortener-Endpoints/createURL', { token, ...URLToAdd })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteURL(aliasIn, token) {
  let status = new ApiResponse();
  const alias = { 'alias': aliasIn };
  await axios
    .post(URL_SHORTENER_URL + '/URLShortener-Endpoints/deleteURL', { token, ...alias })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
