import axios from 'axios';
import { ApiResponse } from './ApiResponses';

// if you are running the website with `sce run c`
// change the below string to:
// http://localhost:8080/api
const DESSERT_API_URL = 'http://localhost:8080/api';

export async function createDessert(newDessert, token) {
  let status = new ApiResponse();
  await axios.post(DESSERT_API_URL + '/Dessert/createDessert',
    newDessert,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}

export async function editDessert(name, description, rating, _id, token) {
  let status = new ApiResponse();
  await axios.post(DESSERT_API_URL + '/Dessert/editDessert',
    name, description, rating, _id,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}

export async function deleteDessert(currDessert, token) {
  let status = new ApiResponse();
  await axios.post(DESSERT_API_URL + '/Dessert/deleteDessert',
    currDessert,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).catch(err => {
    status.error = true;
    status.responseData = err;
  });
  return status;
}

export async function getAllDesserts() {
  let status = new ApiResponse();
  try {
    const res = await fetch(DESSERT_API_URL + '/Dessert/getDesserts');
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
