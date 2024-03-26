import { STATUS_CODES } from "./Constants";
import InvalidJsonBody from "./responses/InvalidJsonBody";

export function parseJSON(req : Request) {
    return req.json().catch(() => {
        throw new InvalidJsonBody();
    });
}