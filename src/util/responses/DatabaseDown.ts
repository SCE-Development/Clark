import { STATUS_CODES } from "../Constants";

/**
 * Response sent if the internal MongoDB Database
 * is down or if the connection failed. Requests should be retried
 * at a later time.
 */
export default class DatabaseDown extends Response {
    constructor() {
        super("Database is currently down. Please retry later.", {
            status: STATUS_CODES.SERVER_ERROR
        });
    }
}