import { STATUS_CODES } from "../Constants";

/**
 * Response that is thrown if a requested item is not
 * found in the database.
 */
export default class ItemNotFound extends Response {
    constructor() {
        super("Item not found.", {
            status: STATUS_CODES.NOT_FOUND
        });
    }
}