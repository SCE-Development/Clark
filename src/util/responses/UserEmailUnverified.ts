import { STATUS_CODES } from "../Constants";

export default class UserEmailUnverified extends Response {
    constructor() {
        super("Email has not been verified. Verify your email then retry.", {
            status: STATUS_CODES.UNAUTHORIZED
        });
    }
}