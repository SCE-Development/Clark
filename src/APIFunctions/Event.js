import axios from 'axios';
import { ApiResponse } from './ApiResponses';

/**
 * Handles the edge case of a time being at midnight and must be converted
 * from 0:20 AM for example.
 * @param {string} time a time to be added to an event
 */
function handleMidnightTime(time) {
  const [hour, suffix] = time.split(':');
  if (hour === '0') return `12:${suffix}`;
  return time;
}

/**
 * Retrieve all events.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of events
 */
export async function getAllEvents() {
  let status = new ApiResponse();
  await axios
    .get('api/event/getEvents')
    .then(res => {
      status.responseData = res.data;
    })
    .catch(err => {
      status.responseData = err;
      status.error = true;
    });
  return status;
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
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function createNewEvent(newEvent, token) {
  let status = new ApiResponse();
  const eventToAdd = {
    title: newEvent.title,
    description: newEvent.description,
    eventLocation: newEvent.eventLocation,
    eventDate: newEvent.eventDate,
    startTime: handleMidnightTime(newEvent.startTime),
    endTime: handleMidnightTime(newEvent.endTime),
    eventCategory: newEvent.eventCategory,
    imageURL: handleImageURL(newEvent.imageURL)
  };
  await axios
    .post('api/event/createEvent', { token, ...eventToAdd })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
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
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function editEvent(eventToUpdate, token) {
  let status = new ApiResponse();
  const eventToEdit = {
    id: eventToUpdate._id,
    title: eventToUpdate.title,
    description: eventToUpdate.description,
    eventLocation: eventToUpdate.eventLocation,
    eventDate: eventToUpdate.eventDate,
    startTime: handleMidnightTime(eventToUpdate.startTime),
    endTime: handleMidnightTime(eventToUpdate.endTime),
    eventCategory: eventToUpdate.eventCategory,
    imageURL: eventToUpdate.imageURL
  };
  await axios
    .post('api/event/editEvent', { token, ...eventToEdit })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Add a new event.
 * @param {Object} eventToDelete - The event that is to be added
 * @param {string} eventToDelete._id - The unique MongoDB
 *                                     id of the event that is to
 * be added
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function deleteEvent(eventToDelete, token) {
  let status = new ApiResponse();
  await axios
    .post('/api/event/deleteEvent', { token, id: eventToDelete._id })
    .then(res => {
      status.responseData = res.data;
    })
    .catch(() => {
      status.error = true;
    });
  return status;
}

/**
 * Convert a 12 hour time to 24 hour time
 * @param {string} time12h A value in 12 hour format e.g. 3:00 PM
 * @returns {string} A time formatted in 24 hours
 */
export function convertTime12to24(time12h) {
  if (!time12h) return;
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  if (hours === '12') {
    hours = '00';
  }
  if (modifier === 'PM') {
    hours = parseInt(hours, 10) + 12;
  } else if (parseInt(hours) < 10 && parseInt(hours) > 0) {
    hours = '0' + String(hours);
  }
  return `${hours}:${minutes}`;
}

/**
 * Convert 24 hour time to 12 hour time
 * @param {string} time24h A value in 24 hour format e.g. 15:00
 */
export function convertTime24to12(time24h) {
  if (!time24h) return;
  const [hour, minute] = time24h.split(':');
  const suffix = parseInt(hour) - 12 > 0 ? 'PM' : 'AM';
  return `${parseInt(hour) % 12}:${minute} ${suffix}`;
}

/**
 * Handles the edge case of a time being at midnight and must be converted
 * from 0:20 AM for example.
 * @param {string} time a time to be added to an event
 */
function handleMidnightTime(time) {
  const [hour, suffix] = time.split(':');
  if (hour === '0') return `12:${suffix}`;
  return time;
}

/**
 * Handles the case in which the image URL is not valid
 * @param {string} url an image url to be added to an event
 */
function handleImageURL(url) {
  if(url !== null) {
    return url
  }
  return 'https://www.freeiconspng.com/uploads/no-image-icon-11.PNG'
}

/**
 * Format a given string to be rendered in an input of type date
 * @param {string} unformattedDate A date separated by slashes e.g. 02/28/1992
 * @returns {string} A formatted date with dashes e.g. 1992-02-28
 */
export function getDateWithDashes(unformattedDate) {
  if (!unformattedDate) return;
  const [month, day, year] = unformattedDate.split('/');
  return [year, month, day].join('-');
}

/**
 * Format a given string to be rendered in an input of type date
 * @param {string} unformattedDate A date separated by dashes e.g. 1992-02-28
 * @returns {string} A formatted date with slashes e.g. 02/28/1992
 */
export function getDateWithSlashes(unformattedDate) {
  if (!unformattedDate) return;
  const [year, month, day] = unformattedDate.split('-');
  return [month, day, year].join('/');
}
