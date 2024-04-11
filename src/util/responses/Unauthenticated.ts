import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown if a authenticated enpoint is accessed without
 * an authentication JWT. The user should authenticate first.
 */
export default class Unauthenticated extends Response {
    constructor() {
        super("You are unauthenticated. Log in to use this api", {
            status: STATUS_CODES.FORBIDDEN
        });
    }
}