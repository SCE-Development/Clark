import { STATUS_CODES } from "../Constants";

export default class VerificationExpired extends Response {
    constructor() {
        super("This verification email has expired. Please resend the email.", {
            status: STATUS_CODES.UNAUTHORIZED
          });
    }
}