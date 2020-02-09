import axios from 'axios'

class ApiResponse {
  constructor () {
    this.error = false
    this.responseData = null
  }
}

/**
 * Checks to see if the sign is accepting requests. This is done
 * before any requests to update the sign can be made.
 * @param {string} officerName The name of the officer requesting the sign
 * @returns {Object} An object containing a boolean
 */
export async function healthCheck (officerName) {
  let signResponse = new ApiResponse()
  await axios
    .post('api/LedSign/healthCheck', { officerName })
    .then(res => {
      signResponse.responseData = res.data
    })
    .catch(err => {
      signResponse.responseData = err
      signResponse.error = true
    })
  return signResponse
}

/**
 * Add a new event.
 * @param {Object} newEvent - The event that is to be added
 * @param {string} newEvent.title - The title of the new event
 * @param {(string|undefined)} newEvent.description - The description of the
 * new event
 * @param {string} newEvent.eventLocation - The location of the new event
 * @param {string} newEvent.eventDate - The late of the new event
 * @param {string} newEvent.startTime - The start time of the new event
 * @param {string} newEvent.endTime - The end time of the new event
 * @param {(string|undefined)} newEvent.eventCategory - The category of the new
 * event
 * @param {(string|undefined)} newEvent.imageURL - A URL of the image of the
 * event
 * @param {string} token - The user's jwt token for authentication
 */
export async function updateSignText (signData) {
  let signResponse = new ApiResponse()
  await axios
    .post('api/LedSign/updateSignText', { ...signData })
    .then(res => {
      signResponse = res.data
    })
    .catch(err => {
      signResponse.responseData = err
      signResponse.error = true
    })
  return signResponse
}
