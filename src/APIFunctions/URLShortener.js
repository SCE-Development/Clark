import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let URL_SHORTENER_URL = 'http://localhost:8080/api';

export async function getAllURLs() {
  let status = new ApiResponse();
  await axios
    .get(URL_SHORTENER_URL + '/URLShortener-Endpoints/listAll')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createURL(url, alias = null) {
  let status = new ApiResponse();
  await axios
    .post(URL_SHORTENER_URL + '/URLShortener-Endpoints/createURL', { 'url': url, 'alias': alias })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteURL(alias) {
  let status = new ApiResponse();
  await axios
    .post(URL_SHORTENER_URL + '/URLShortener-Endpoints/deleteURL', { alias })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}
