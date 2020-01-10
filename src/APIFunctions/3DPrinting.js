import axios from 'axios'

/**
 * Submit a user's print request.
 * @param {Object} printRequest - The request containing all of the project's
 * information.
 * @param {string} printRequest.name - The full name of the user.
 * @param {string} printRequest.color - The user's preferred color of the
 * print.
 * @param {string} printRequest.comment - Any comments left on the request.
 * @param {string} printRequest.contact - An email to contact the user with.
 * @param {string} printRequest.projectType - e.g. Personal, School.
 * @param {string} printRequest.url - e.g. URL to the print file.
 * @param {string} printRequest.email - Any comments left on the request.
 * @returns {boolean} - If the request was successfully submitted or not.
 */
export async function submit3DPrintRequest (printRequest) {
  let isSubmitted = false
  const {
    name,
    color,
    comment,
    contact,
    projectType,
    url,
    email
  } = printRequest
  await axios
    .post('/api/3DPrintingForm/submit', {
      name,
      color,
      comment,
      contact,
      projectType,
      url,
      progress: 'Pending',
      email
    })
    .then(result => {
      isSubmitted = true
    })
    .catch(() => {
      isSubmitted = false
    })
  return isSubmitted
}

/**
 * Query the database for all 3D print requests.
 * @returns {(Object[]|string)} - The list of requests or error from the API.
 */
export async function getAll3DPrintRequests () {
  let allRequests = []
  await axios
    .post('/api/3DPrintingForm/GetForm', {})
    .then(result => {
      allRequests = result.data
    })
    .catch(err => {
      allRequests = err
    })
  return allRequests
}

/**
 * Delete a specified 3D print request by it's date and email.
 * @param {Object} requestToDelete - The request containing all of the
 * project's information.
 * @param {string} requestToDelete.date - The date the request was created.
 * @param {string} requestToDelete.email - The requesting user's email.
 * @param {string} token - The user's authentication token.
 * @returns {boolean} - If the request was sucessfully deleted or not.
 */
export async function delete3DPrintRequest (requestToDelete, token) {
  let isDeleted = false
  const { date, email } = requestToDelete
  await axios
    .post('/api/3DPrintingForm/delete', {
      token,
      date,
      email
    })
    .then(result => {
      isDeleted = true
    })
    .catch(() => {
      isDeleted = false
    })
  return isDeleted
}

/**
 * Update a specified 3D print request by it's date and email.
 * @param {Object} requestToUpdate - The request containing all of the
 * project's information.
 * @param {string} requestToUpdate.date - The date the request was created.
 * @param {string} requestToUpdate.email - The requesting user's email.
 * @param {string} token - The user's authentication token.
 * @returns {boolean} - If the request was sucessfully deleted or not.
 */
export async function update3DPrintRequestProgress (requestToUpdate, token) {
  let isUpdated = false
  const { date, email, progress } = requestToUpdate
  await axios
    .post('/api/3DPrintingForm/edit', {
      date,
      email,
      progress,
      token
    })
    .then(result => {
      isUpdated = true
    })
    .catch(() => {
      isUpdated = false
    })
  return isUpdated
}
