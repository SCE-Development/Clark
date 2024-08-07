import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';


export async function getAd() {
  let status = new ApiResponse();
  await axios.get(BASE_API_URL + '/api/Advertisement/')
    .then(res => {
      status.responseData = res.data;
    }).catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function getAds(token) {
  let status = new ApiResponse();
  await axios.get(BASE_API_URL + '/api/Advertisement/getAllAdvertisements',
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
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
  await axios.post(BASE_API_URL + '/api/Advertisement/createAdvertisement',
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
  await axios.post(BASE_API_URL + '/api/Advertisement/deleteAdvertisement',
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
