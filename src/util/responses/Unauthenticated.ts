import { STATUS_CODES } from "../Constants";

export default class Unauthenticated extends Response {
    constructor() {
        super("You are unauthenticated. Log in to use this api", {
            status: STATUS_CODES.FORBIDDEN
        });
    }
}