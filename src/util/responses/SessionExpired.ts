import { STATUS_CODES } from "../Constants";

export default class SessionExpired extends Response {
    constructor() {
        super("Your session has expired. Please log in again.", {
            status: STATUS_CODES.UNAUTHORIZED
          });
    }
}