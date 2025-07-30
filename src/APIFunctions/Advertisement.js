import { ApiResponse } from './ApiResponses';
import { BASE_API_URL } from '../Enums';


export async function getAd() {
  let status = new ApiResponse();
  try {
    const res = await fetch (BASE_API_URL + '/api/Advertisement/');
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function getAds(token) {
  let status = new ApiResponse();
  try {
    const res = await fetch(BASE_API_URL + '/api/Advertisement/getAllAdvertisements',
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    if (res.ok) {
      status.responseData = await res.json();
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function createAd(newAd, token) {
  let status = new ApiResponse();
  try {
    const res = await fetch(BASE_API_URL + '/api/Advertisement/createAdvertisement',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAd)
      }
    );
    if (res.ok) {
      const result = await res.json();
      status.responseData = result;
    } else {
      status.error = true;
    }

  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}

export async function deleteAd(newAd, token) {
  let status = new ApiResponse();
  try {
    const res = await fetch(BASE_API_URL + '/api/Advertisement/deleteAdvertisement',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAd)
      }
    );
    if (res.ok) {
      const result = await res.json();
      status.responseData = res;
    } else {
      status.error = true;
    }
  } catch (err) {
    status.responseData = err;
    status.error = true;
  }
  return status;
}