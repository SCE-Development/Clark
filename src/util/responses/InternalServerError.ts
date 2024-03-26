import { STATUS_CODES } from "../Constants";

export default class InternalServerError extends Response {
    constructor() {
        super("Something went wrong with the server. ", {
            status: STATUS_CODES.SERVER_ERROR
        });
    }
}