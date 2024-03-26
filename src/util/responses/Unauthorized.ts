import { STATUS_CODES } from "../Constants";

export default class Unauthorized extends Response {
    constructor() {
        super("You do not have permission to use this. Please do not retry", {
            status: STATUS_CODES.UNAUTHORIZED
          });
    }
}