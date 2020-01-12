import axios from 'axios'

/**
 * Retrieve all events.
 * @returns {Object[]} an array of all events
 */
export async function getAllEvents () {
  let allEvents = []
  await axios
    .get('api/event/getEvents')
    .then(res => {
      allEvents = res.data
    })
    .catch(err => {
      allEvents = err
    })
  return allEvents
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
export async function createNewEvent (newEvent, token) {
  let eventCreated = false
  const eventToAdd = {
    title: newEvent.title,
    description: newEvent.description,
    eventLocation: newEvent.eventLocation,
    eventDate: newEvent.eventDate,
    startTime: newEvent.startTime,
    endTime: newEvent.endTime,
    eventCategory: newEvent.eventCategory,
    imageURL: newEvent.imageURL
  }
  await axios
    .post('api/event/createEvent', { token, ...eventToAdd })
    .then(res => {
      eventCreated = true
    })
    .catch(() => {
      eventCreated = false
    })
  return eventCreated
}

/**
 * Add a new event.
 * @param {Object} eventToUpdate - The event that is to be updated
 * @param {string} eventToUpdate._id - The unique MongoDB id of the event
 * @param {(string|undefined)} eventToUpdate.title - The updated title of the
 * event
 * @param {(string|undefined)} eventToUpdate.description - The updated
 * description of the event
 * @param {(string|undefined)} eventToUpdate.eventLocation - The updated
 * location of the event
 * @param {(string|undefined)} eventToUpdate.eventDate - The updated date of
 * the event
 * @param {(string|undefined)} eventToUpdate.startTime - The updated start time
 * of the event
 * @param {(string|undefined)} eventToUpdate.endTime - The updated end time of
 * the event
 * @param {(string|undefined)} eventToUpdate.eventCategory - The updated
 * eventCategory of the event
 * @param {(string|undefined)} eventToUpdate.imageURL - An updated image URL of
 * the event
 * @param {string} token - The user's jwt token for authentication
 */
export async function editEvent (eventToUpdate, token) {
  let eventUpdated = false
  const eventToEdit = {
    id: eventToUpdate._id,
    title: eventToUpdate.title,
    description: eventToUpdate.description,
    eventLocation: eventToUpdate.eventLocation,
    eventDate: eventToUpdate.eventDate,
    startTime: eventToUpdate.startTime,
    endTime: eventToUpdate.endTime,
    eventCategory: eventToUpdate.eventCategory,
    imageURL: eventToUpdate.imageURL
  }
  await axios
    .post('api/event/editEvent', { token, ...eventToEdit })
    .then(res => {
      eventUpdated = true
    })
    .catch(() => {
      eventUpdated = false
    })
  return eventUpdated
}

/**
 * Add a new event.
 * @param {Object} eventToDelete - The event that is to be added
 * @param {string} eventToDelete._id - The unique MongoDB id of the event that is to
 * be added
 * @param {string} token - The user's jwt token for authentication
 */
export async function deleteEvent (eventToDelete, token) {
  let eventDeleted = false
  await axios
    .post('/api/event/deleteEvent', { token, id: eventToDelete._id })
    .then(res => {
      eventDeleted = true
    })
    .catch(() => {
      eventDeleted = false
    })
  return eventDeleted
}
