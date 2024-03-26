import { STATUS_CODES } from "../Constants";

export default class BadRequest extends Response {
    constructor() {
        super("Bad Request. Please do not retry without modification.", {
            status: STATUS_CODES.BAD_REQUEST
        });
    }
}