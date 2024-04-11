import { STATUS_CODES } from "../Constants";

export default class EmailConflict extends Response {
    constructor() {
        super("This email is already in use.", {
            status: STATUS_CODES.CONFLICT
        });
    }
}