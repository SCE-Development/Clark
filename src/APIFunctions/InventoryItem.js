import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { GENERAL_API_URL } from '../config/config.json';

export async function getAllItems(){
  let status = new ApiResponse();
  await axios
    .get(GENERAL_API_URL+'/InventoryItem/getItems')
    .then(res =>{
      status.responseData = res.data;
    })
    .catch(err=>{
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function addItem(reqItemToAdd, token){
  let status = new ApiResponse();
  const itemToAdd = {
    name: reqItemToAdd.name,
    price: reqItemToAdd.price,
    stock: reqItemToAdd.stock,
    category: reqItemToAdd.category,
    description: reqItemToAdd.description,
    picture: reqItemToAdd.picture
  };
  await axios
    .post(GENERAL_API_URL+'/InventoryItem/addItem', {token, ...itemToAdd})
    .then(res =>{
      status.responseData = res.data;
    })
    .catch(err=>{
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function editItem(reqItemToEdit, token){
  let status = new ApiResponse();
  const itemToEdit = {
    name: reqItemToEdit.name,
    price: reqItemToEdit.price,
    stock: reqItemToEdit.stock,
    category: reqItemToEdit.category,
    description: reqItemToEdit.description,
    picture: reqItemToEdit.picture
  };
  await axios
    .post(GENERAL_API_URL+'/InventoryItem/editItem', {token, ...itemToEdit})
    .then(res =>{
      status.responseData = res.data;
    })
    .catch(err=>{
      status.responseData = err;
      status.error = true;
    });
  return status;
}

export async function deleteItem(reqItemToDelete, token){
  let status = new ApiResponse();
  await axios
    .post(GENERAL_API_URL+'/InventoryItem/deleteItem',
      { token, name: reqItemToDelete.name })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

