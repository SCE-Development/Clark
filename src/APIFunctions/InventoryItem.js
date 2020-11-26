import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { GENERAL_API_URL } from '../config/config.json';

/**
 * Retrieve all items.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of inventory items
 */
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

/**
 * Add a new inventory item.
 * @param {Object} reqItemToAdd - The item that is to be added
 * @param {string} reqItemToAdd.name - The name of the item
 * @param {string} reqItemToAdd.price - The price of the item
 * @param {string} reqItemToAdd.stock - The stock of the item
 * @param {string} reqItemToAdd.category - The category of the item
 * @param {string} reqItemToAdd.description - The description of the item
 * @param {(string|undefined)} reqItemToAdd.picture - The picture URL of
 * the item
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
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

/**
 * Edit a preexisting inventory item.
 * @param {Object} reqItemToEdit - The item that is to be edited
 * @param {string} reqItemToEdit.name - The name of the item
 * @param {string} reqItemToEdit.price - The price of the item
 * @param {string} reqItemToEdit.stock - The stock of the item
 * @param {string} reqItemToEdit.category - The category of the item
 * @param {string} reqItemToEdit.description - The description of the item
 * @param {(string|undefined)} reqItemToEdit.picture - The picture URL of
 * the item
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
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

/**
 * Delete a preexisting inventory item.
 * @param {Object} reqItemToDelete - The item that is to be deleted
 * @param {string} reqItemToDelete.name - The name of the item
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
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

