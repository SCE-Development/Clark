import InvalidJsonBody from "./responses/InvalidJsonBody";

export function parseJSON(req : Request) {
    
    return req.json().catch(() => {
        console.log("fuck this shit")
        throw new InvalidJsonBody();
    });
}