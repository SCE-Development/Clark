import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let GENERAL_API_URL = 'http://localhost:8080/api';

export async function getAds() {
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

export async function createAd(newAd, token) {
  let status = new ApiResponse();
  await axios.post(GENERAL_API_URL + '/Advertisement/createAdvertisement',
    newAd,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      status.responseData = res.data;
    }).catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteAd(newAd, token) {
  let status = new ApiResponse();
  await axios.post(GENERAL_API_URL + '/Advertisement/deleteAdvertisement',
    newAd,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      status.responseData = res.data;
    }).catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}