import { STATUS_CODES } from "../Constants";

export default class UserBanned extends Response {
    constructor() {
        super("This is user is banned. Do not retry.", {
            status: STATUS_CODES.UNAUTHORIZED
        });
    }
}