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
