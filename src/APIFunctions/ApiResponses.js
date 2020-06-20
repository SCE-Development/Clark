/**
 * Class to hold the server responses
 * @member {bool} error - Lets us know if there was any error regarding
 * the API call. This variable should be false if there was no error.
 * @member {any} responseData - Contains anything we would like to return
 * from the API call (e.g. object array or error data)
 * @member {string|null} token - An authentication token
 */
export class ApiResponse {
  constructor(error = false, responseData = null) {
    this.error = error;
    this.responseData = responseData;
  }
}

/**
 * Class to hold the server responses
 * @extends {ApiResponse}
 * @member {string|null} token - An authentication token
 */
export class UserApiResponse extends ApiResponse {
  constructor(error = false, responseData = null) {
    super(error, responseData);
    this.token = null;
  }
}

/**
 * Class to hold the server responses
 * @extends {ApiResponse}
 * @member {bool} canPrint - If the user can print given the number of pages
 * they have left
 * @member {number} remainingPages - The number of remaining pages a user has
 * to print
 */
export class PrintApiResponse extends ApiResponse {
  constructor(error = false, responseData = null) {
    super(error, responseData);
    this.canPrint = false;
    this.remainingPages = 0;
  }
}

/**
 * Class to hold the server responses
 * @extends {ApiResponse}
 * @member {object} data - The print logs in the database
 */
export class PrintLogApiResponse extends ApiResponse {
  constructor(error = false, responseData = null) {
    super(error, responseData);
    this.data = [];
  }
}
