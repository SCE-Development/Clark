import { STATUS_CODES } from "../Constants";

export default class InvalidCredential extends Response {
    constructor() {
        super("Email or password is incorrect", {
            status: STATUS_CODES.UNAUTHORIZED
        });
    }
}