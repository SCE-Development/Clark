import { STATUS_CODES } from "../Constants";

/**
 * Response that is sent if the api request contained bad inputs.
 * These requests should not be retried without modification.
 */
export default class BadRequest extends Response {
    constructor() {
        super("Bad Request. Please do not retry without modification.", {
            status: STATUS_CODES.BAD_REQUEST
        });
    }
}