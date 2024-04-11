import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown if a user enters a: 
 *  - email that does not exist in the db
 *  - password that does not match with the email in the db
 */
export default class InvalidCredential extends Response {
    constructor() {
        super("Email or password is incorrect", {
            status: STATUS_CODES.UNAUTHORIZED
        });
    }
}