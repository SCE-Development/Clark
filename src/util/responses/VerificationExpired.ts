import { STATUS_CODES } from "../Constants";


/**
 * Response thrown if the verification link from an email has expired.
 * Prompt user to resend the email.
 */
export default class VerificationExpired extends Response {
    constructor() {
        super("This verification email has expired. Please resend the email.", {
            status: STATUS_CODES.UNAUTHORIZED
          });
    }
}