import { STATUS_CODES } from "../Constants";

/**
 * Ok response.
 */
export default class Ok extends Response {
    constructor() {
        super("", {
            status: STATUS_CODES.OK
        });
    }
}