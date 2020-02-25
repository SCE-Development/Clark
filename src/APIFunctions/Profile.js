import axios from 'axios'

export async function sendVerificationEmail (email, firstName) {
  let emailSent = false
  await axios
    .post('/api/mailer', {
      templateType: 'verification',
      recipientEmail: email,
      recipientName: firstName
    })
    .then(() => {
      emailSent = true
    })
    .catch(error => {
      console.log(error)
    })
  return emailSent
}

export async function validateVerificationEmail (email, hashedId) {
  let emailValidated = false
  await axios
    .post('/api/user/validateEmail', {
      email: email,
      hashedId: hashedId
    })
    .then(() => {
      emailValidated = true
    })
    .catch(err => {
      console.log(err)
    })
  return emailValidated
}

export async function setEmailToVerified (email) {
  let emailSetToVerified = false
  await axios
    .post('/api/user/setEmailToVerified', {
      email: email
    })
    .then(() => {
      emailSetToVerified = true
    })
    .catch(err => {
      console.log(err)
    })
  return emailSetToVerified
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
