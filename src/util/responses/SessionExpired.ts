import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown if the authentication JWT has expired.
 * Prompt the user to log in again.
 */
export default class SessionExpired extends Response {
    constructor() {
        super("Your session has expired. Please log in again.", {
            status: STATUS_CODES.UNAUTHORIZED
          });
    }
}