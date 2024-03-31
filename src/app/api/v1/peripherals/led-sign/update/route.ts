import { Session } from "@/util/Authenticate";
import { IN_DEVELOPMENT_MODE, MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";

export interface LedSignConfig {
    scrollSpeed: number,
    backgroundColor: string,
    textColor: string,
    borderColor: string,
    text: string,
};

export interface RequestBody {
    token: string,
    displayed: LedSignConfig
};



const LED_SIGN_URL = process.env.LED_SIGN_URL || 'http://localhost';

export async function POST(req: Request) {
    try {

        
        const body = await parseJSON(req) as RequestBody;
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.MEMBER);



        if(IN_DEVELOPMENT_MODE) {
            return Response.json({ disabled: true });
        }

        if(typeof(body.displayed) !== "object") throw new BadRequest();
        if(typeof(body.displayed?.scrollSpeed) !== "number") throw new BadRequest();
        if(typeof(body.displayed?.backgroundColor) !== "string") throw new BadRequest();
        if(typeof(body.displayed?.textColor) !== "string") throw new BadRequest();
        if(typeof(body.displayed?.text) !== "string") throw new BadRequest();

        const { scrollSpeed, backgroundColor, borderColor, text, textColor } = body.displayed;
        
        /*
        * How these work with Quasar:
        * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
        */

        const result = await fetch(`${LED_SIGN_URL}/api/update-sign`, {
            body: JSON.stringify({ scrollSpeed, backgroundColor, borderColor, text, textColor }),
            method: "POST",
            headers: {
                "content-type": "application/json"
            }
        })
            .then(res => res.json())
            .catch(() => { throw new InternalServerError(); });

        return Response.json({ result });
    }catch(response) {
        return response;
    }


}