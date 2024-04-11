import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown if the user does not have permission
 * to access a given endpoint.
 */
export default class Unauthorized extends Response {
    constructor() {
        super("You do not have permission to use this. Please do not retry", {
            status: STATUS_CODES.UNAUTHORIZED
          });
    }
}