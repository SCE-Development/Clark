import { STATUS_CODES } from "../Constants";

export default class ItemNotFound extends Response {
    constructor() {
        super("Item not found.", {
            status: STATUS_CODES.NOT_FOUND
        });
    }
}