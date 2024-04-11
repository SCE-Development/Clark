import { STATUS_CODES } from "../Constants";

/**
 * Response that is sent if the api request contained a malformed JSON body.
 * These requests should not be retried without modification.
 */
export default class InvalidJsonBody extends Response {
    constructor() {
        super("Malformed JSON body. Please do not retry without modification.", {
            status: STATUS_CODES.BAD_REQUEST
        });
    }
}