import { STATUS_CODES } from "../Constants";

/**
 * Response thrown if the user has not verified their email.
 */
export default class UserEmailUnverified extends Response {
    constructor() {
        super("Email has not been verified. Verify your email then retry.", {
            status: STATUS_CODES.UNAUTHORIZED
        });
    }
}