import { STATUS_CODES } from "../Constants";

/**
 * Thrown when periphal (LED sign/Printer) is not avaliable. Retry at a 
 * later time.
 */
export default class PeripheralNotAvaliable extends Response {
    constructor() {
        super("This peripheral is not avaliable. ", {
            status: 503
        });
    }
}