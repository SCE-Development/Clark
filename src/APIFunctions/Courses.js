import axios from 'axios';
import { ApiResponse } from './ApiResponses';
import { GENERAL_API_URL } from '../config/config.json';

/**
 * Retrieve all courses.
 * @returns {ApiResponse} Containing any error information related to the
 * request or the list of courses
 */
export async function getAllCourses() {
    let status = new ApiResponse();
    await axios.get(GENERAL_API_URL + '/course/getCourses')
        .then(res => status.responseData = res.data)
        .catch(error => {
            status.responseData = error;
            status.error = true;
        });
    return status;
}

function checkImageURL(url) {
    return (url !== null && url) ? url : 'https://rb.gy/gnrdda';
}

/**
 * Add a new course
 * @param {Object} newCourse - The course that is to be added
 * @param {string} newCourse.title - The title of the new course
 * @param {(string|undefined)} newCourse.description - The description of the
 * new course
 * @param {string} newCourse.author - The author of the new course
 * @param {(string|undefined)} newCourse.imageURL - A URL of the image of the
 * course
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function createNewCourse(newCourse, token) {
    let status = new ApiResponse();
    const course = {
        title: newCourse.title,
        author: newCourse.author,
        description: newCourse.description,
        imageURL: checkImageURL(newCourse.imageURL)
    };
    await axios
        .post(GENERAL_API_URL + '/course/createCourse', { token, ...course })
        .then(res => status.responseData = res.data)
        .catch(() => status.error = true);
    return status;
}

/**
 * Edit a course
 * @param {Object} courseToUpdate - The course that is to be updated
 * @param {string} courseToUpdate.title - The updated title of the course
 * @param {(string|undefined)} courseToUpdate.description - The updated
 * description of the course
 * @param {string} courseToUpdate.author - The updated author of the course
 * @param {(string|undefined)} courseToUpdate.imageURL - The updated
 * image URL of the course
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request or the response data
 */
export async function editCourse(courseToUpdate, token) {
    let status = new ApiResponse();
    const course = {
        _id: courseToUpdate._id,
        title: courseToUpdate.title,
        author: courseToUpdate.author,
        description: courseToUpdate.description,
        lessons: courseToUpdate.lessons,
        imageURL: checkImageURL(courseToUpdate.imageURL),
    };
    await axios 
        .post(GENERAL_API_URL + '/course/editCourse', { token, ...course })
        .then(res => status.responseData = res.data)
        .catch(() => status.error = true);
    return status;
}

/**
 * Delete a course.
 * @param {Object} courseToDelete - The course that is to be added
 * @param {string} courseToDelete._id - The unique MongoDB
 * id of the course that is to be deleted
 * @param {string} token - The user's jwt token for authentication
 * @returns {ApiResponse} Containing any error information related to the
 * request
 */
export async function deleteCourse(courseToDelete, token) {
    let status = new ApiResponse();
    await axios 
        .post(GENERAL_API_URL + '/course/deleteCourse', 
            { token, id: courseToDelete._id })
        .then(res => status.responseData = res.data)
        .catch(() => status.error = true)
    return status;
}
