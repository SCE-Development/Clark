import axios from 'axios'

/**
 * Class to hold the server responses
 * @member {bool} error - Lets us know if there was any error regarding
 * the API call. This variable should be false if there was no error.
 * @member {any} responseData - Contains anything we would like to return
 * from the API call (e.g. object array or error data)
 * @member {string|null} token - An authentication token
 */
class ApiResponse {
  constructor () {
    this.error = false
    this.responseData = null
    this.token = null
  }
}

/**
 * Queries the database for all users.
 * @param {string} token The jwt token for verification
 * @returns {ApiResponse} Containing any error information or the array of
 * users.
 */
export async function getAllUsers (token) {
  const status = new ApiResponse()
  await axios
    // get all user!
    .post('/api/user/users', {
      // don't need email
      token
    })
    .then(result => {
      status.responseData = result.data
    })
    .catch(() => {
      status.error = true
    })
  return status
}

/**
 * Checks if the user is signed in by evaluating a jwt token in local storage.
 * @returns {ApiResponse} Containing information for whether the user is signed
 * in or not
 */
export async function checkIfUserIsSignedIn () {
  const status = new ApiResponse()

  const token = window.localStorage
    ? window.localStorage.getItem('jwtToken')
    : ''

  // If there is not token in local storage,
  // we cant do anything and return
  if (!token) {
    status.error = true
    return status
  }

  await axios
    .post('/api/user/verify', { token })
    .then(res => {
      status.responseData = res.data
      status.token = token
    })
    .catch(err => {
      status.error = true
      status.responseData = err
    })
  return status
}

/**
 * Add a new user to the database.
 * @param {Object} userToRegister - The object containing all of the user's
 * information
 * @param {(string|undefined)} userToRegister.firstName
 * @param {(string|undefined)} userToRegister.lastName
 * @param {(string|undefined)} userToRegister.email
 * @param {(string|undefined)} userToRegister.password - This is hashed in the
 * frontend
 * @param {(string|undefined)} userToRegister.major
 * @param {(string|undefined)} userToRegister.numberOfSemestersToSignUpFor
 */
export async function registerUser (userToRegister) {
  const status = new ApiResponse()
  const {
    firstName,
    lastName,
    email,
    password,
    major,
    numberOfSemestersToSignUpFor
  } = userToRegister
  await axios
    .post('/api/user/register', {
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor
    })
    .then(result => {
      status.responseData = result
    })
    .catch(err => {
      status.error = true
      status.responseData = err.response
    })
  return status
}

/**
 * Updates the user's last login date when they log in.
 * @param {string} email The email of the user
 * @param {string} token The JWT token to allow the user to be edited
 */
async function updateLastLoginDate (email, token) {
  await editUser({ email, lastLogin: Date.now() }, token)
}

/**
 * Logs in the user with their email and password. Also updates the last login
 * date for the user.
 * @param {string} email The email of the user
 * @param {string} password The password of the user
 * @returns {ApiResponse} Contains the generated JWT token or any error data
 */
export async function loginUser (email, password) {
  const status = new ApiResponse()
  await axios
    .post('/api/user/login', { email, password })
    .then(async result => {
      status.token = result.data.token
      await updateLastLoginDate(email, result.data.token)
      window.location.reload()
    })
    .catch(error => {
      status.error = true
      status.responseData = error.response
    })
  return status
}

/**
 * Edit an existing users
 * @param {Object} userToEdit - The user that is to be updated
 * @param {(string|undefined)} userToEdit.firstName - The updated first name of
 * the user
 * @param {(string|undefined)} userToEdit.lastName - The updated last name of
 * the user
 * @param {string} userToEdit.email - Used to find the specific user to update
 * @param {(string|undefined)} userToEdit.password - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.major - The updated major of
 * the user
 * @param {(string|undefined)} userToEdit.numberOfSemestersToSignUpFor
 * @param {(string|undefined)} userToEdit.doorCode - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.pagesPrinted - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.accessLevel - The updated password of
 * the user
 * @param {(string|undefined)} userToEdit.lastLogin - The updated password of
 * the user
 * @param {string} token - The jwt token for authentication
 */
export async function editUser (userToEdit, token) {
  const status = new ApiResponse()
  const {
    firstName,
    lastName,
    email,
    password,
    major,
    numberOfSemestersToSignUpFor,
    doorCode,
    pagesPrinted,
    accessLevel,
    lastLogin
  } = userToEdit
  await axios
    .post('/api/user/edit', {
      firstName,
      lastName,
      email,
      password,
      major,
      numberOfSemestersToSignUpFor,
      doorCode,
      pagesPrinted,
      accessLevel,
      lastLogin,
      token
    })
    .then(result => {
      status.error = false
      status.responseData = result.data
    })
    .catch(err => {
      status.error = true
      status.responseData = err.response
    })
  return status
}

/**
 * Deletes a user by an email
 * @param {string} email The email of the user to delete
 * @param {string} token jwt token to authorize deletion
 * @returns {boolean} if the deletion was successful
 */
export async function deleteUserByEmail (email, token) {
  let deleteSuccessful = false
  axios
    .post('/api/user/delete', {
      token,
      email
    })
    .then(() => {
      deleteSuccessful = true
    })
  return deleteSuccessful
}

/**
 * Finds a user by a specific email
 * @param {string} email the email to search a user by
 * @param {string} token the jwt token to authorize the search
 * @returns {ApiResponse} containing if the search was successfult and the
 * data of a user if found.
 */
export async function searchUserByEmail (email, token) {
  const status = new ApiResponse()
  await axios
    .post('/api/user/search', {
      token,
      email
    })
    .then(result => {
      status.responseData = result.data
    })
    .catch(() => {
      status.error = true
    })
  return status
}

/**
 * This function checks the user database to see if a given email already
 * exists or not.
 * @param {string} email The email value to check
 * @returns {boolean} true if email does exist, false if not
 */
export async function checkIfUserExists (email) {
  let userExists = false
  await axios
    .post('/api/user/checkIfUserExists', { email })
    .then(() => {
      userExists = false
    })
    .catch(() => {
      userExists = true
    })
  return userExists
}
