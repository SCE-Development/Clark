import axios from 'axios'
import { storage } from '../APIFunctions/Firebase'

/**
 * Delete a picture from the collection 'officers' on Firebase
 * @param {String} imageName - The name of the image to be deleted
 */
export function deletePicture (imageName) {
  storage
    .ref(`officers/${imageName}`)
    .delete()
    .catch(() => {})
}

/**
 * Upload a picture to the collection 'officers' on Firebase
 * @param {Object} image - the image object
 * @param {string} image.name - the name of the image
 */
export function uploadPicture (image) {
  storage
    .ref(`officers/${image.name}`)
    .put(image)
    .then(snapshot => {
      console.log('Sending')
    })
    .catch(() => {})
    .then(() => {
      console.log('Done')
    })
}

/**
 * Upload a picture to the collection 'officers' on Firebase
 * @param {string} token - token for authentication
 * @return {(Object[]|string)} - list of requested officer or err
 */
export async function getOfficers (token) {
  let officers
  await axios
    // get all officers!
    .post('/api/officerManager/GetForm', {
      // don't need email
      token: token
    })
    .then(result => {
      if (result.status >= 200 && result.status < 300) {
        officers = result.data
      }
    })
    .catch(() => {})
  return officers
}

/**
 * Upload a picture to the collection 'officers' on Firebase
 * @param {string} token - token for authentication
 * @return {(Object[]|string)} - list of requested users or err
 */
export async function getUsers (token) {
  let users
  await axios
    // get all users!
    .post('/api/user/users', {
      // don't need email
      token: token
    })
    .then(result => {
      if (result.status >= 200 && result.status < 300) {
        users = result.data
      }
    })
    .catch(() => {})
  return users
}

/**
 * Delete an officer from the collection 'OfficerManager' on Mongodb
 * @param {string} token - token for authentication
 * @param {string} officerEmail - emai of the officer to be deleted
 */
export async function deleteOfficer (officerEmail, token) {
  await axios
    // get all officers!
    .post('/api/officerManager/delete', {
      // don't need email
      email: officerEmail,
      token: token
    })
    .catch(() => {})
}

/**
 * Edit an officer from the collection 'OfficerManager' on Mongodb
 * changing their accessLevel
 * @param {string} token - token for authentication
 * @param {string} officerEmail - emai of the officer to be edited
 */
export async function editAccessLevel (officerEmail, accessLevel, token) {
  await axios
    .post('/api/user/edit', {
      queryEmail: officerEmail,
      accessLevel: accessLevel,
      token: token
    })
    .catch(() => {})
}

/**
 * Submiting an officer to the collection 'OfficerManager' on Mongodb
 * @param {string} token - token for authentication
 * @param {Object} officer - officer object with all its data, model from api/models/OfficerManager
 */
export async function submitOfficer (officer, token) {
  await axios
    .post('/api/officerManager/submit', {
      ...officer,
      token: token
    })
    .catch(() => {})
}

/**
 * Editing an officer to the collection 'OfficerManager' on Mongodb
 * @param {string} token - token for authentication
 * @param {Object} officer - officer object with all its data, model from api/models/OfficerManager
 */
export async function editOfficer (officer, token) {
  await axios
    .post('/api/officerManager/edit', {
      ...officer,
      token: token
    })
    .catch(() => {})
}

/**
 * Checking an officer in the collection 'OfficerManager' on Mongodb
 * @param {String} email - email to search for
 * @param {Object} token - token for authentication
 * @return {boolean} - wherether the officer is existed in the collection
 */
export async function checkExistedUser (email, token) {
  let status = true
  await axios
    .post('/api/officerManager/GetForm', {
      email: email,
      token: token
    })
    .then(result => {
      if (result.data.length > 0) {
        status = false
        window.alert('Officer is already in the table')
      }
    })
    .catch(() => {})
  return status
}
