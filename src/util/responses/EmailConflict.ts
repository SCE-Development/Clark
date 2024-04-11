import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown when a user attempts
 * to register with an email that is already registered
 * in the user database. This request should not be retried
 * without modification.
 */
export default class EmailConflict extends Response {
    constructor() {
        super("This email is already in use.", {
            status: STATUS_CODES.CONFLICT
        });
    }
}