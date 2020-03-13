import axios from 'axios'
import { ApiResponse } from './ApiResponses'

/**
 * Invoke the gmail API to send an email to verify a user.
 * @param {string} email - The user's email
 * @param {string} firstName - The user's first name
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function sendVerificationEmail (email, firstName) {
  let status = new ApiResponse()
  await axios
    .post('/api/mailer', {
      templateType: 'verification',
      recipientEmail: email,
      recipientName: firstName
    })
    .catch(error => {
      status.error = true
      status.responseData = error
    })
  return status
}

export async function validateVerificationEmail (email, hashedId) {
  let status = new ApiResponse()
  await axios
    .post('/api/user/validateEmail', {
      email,
      hashedId
    })
    .catch(err => {
      status.responseData = err
      status.error = true
    })
  return status
}

/**
 * Set a user's account to be verified
 * @param {string} email - The user's email
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function setEmailToVerified (email) {
  let status = new ApiResponse()
  await axios
    .post('/api/user/setEmailToVerified', {
      email
    })
    .catch(err => {
      status.responseData = err
      status.error = true
    })
  return status
}

/**
 * Formats the first and last name by making sure the first letter of both are uppercase
 * @param {Object} user - The object contianing all of the user data fetched from mangoDB
 * @param {String} user.firstName - The first name of the user
 * @param {String} user.lastName - The last name of the user
 * @returns {String} The string of the users first and last name formated
 */
export function formatFirstAndLastName (user) {
  return (
    user.firstName[0].toUpperCase() +
    user.firstName.slice(1, user.firstName.length) +
    ' ' +
    user.lastName[0].toUpperCase() +
    user.lastName.slice(1, user.lastName.length)
  )
}
