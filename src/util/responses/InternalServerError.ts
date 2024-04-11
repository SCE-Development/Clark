import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown if an unknown error is thrown in the server that do not
 * relate to bad user input. Requests may be retried a few times, otherwise contact someone
 * who can look into the issue.
 */
export default class InternalServerError extends Response {
    constructor() {
        super("Something went wrong with the server. ", {
            status: STATUS_CODES.SERVER_ERROR
        });
    }
}