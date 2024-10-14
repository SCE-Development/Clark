import axios from 'axios';
import { ApiResponse } from './ApiResponses';

let FOOD_API_URL = 'http://localhost:8084/food_api';

export async function getAllFoods() {
  let status = new ApiResponse();
  await axios
    .get(FOOD_API_URL + '/Food/getFoods')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function createFood(newFood, token) {
  let status = new ApiResponse();
  await axios.post(FOOD_API_URL + '/Food/createFood',
    newFood,
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