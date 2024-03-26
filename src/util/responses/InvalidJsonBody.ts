import { STATUS_CODES } from "../Constants";

export default class InvalidJsonBody extends Response {
    constructor() {
        super("Malformed JSON body. Please do not retry without modification.", {
            status: STATUS_CODES.BAD_REQUEST
        });
    }
}