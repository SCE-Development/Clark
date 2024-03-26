import { STATUS_CODES } from "../Constants";

export default class DatabaseDown extends Response {
    constructor() {
        super("Database is currently down. Please retry later.", {
            status: STATUS_CODES.SERVER_ERROR
        });
    }
}