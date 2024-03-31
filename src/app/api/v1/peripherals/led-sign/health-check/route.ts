import { Session } from "@/util/Authenticate";
import { IN_DEVELOPMENT_MODE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";

const LED_SIGN_URL = process.env.LED_SIGN_URL || 'http://localhost';


export interface RequestBody {
    token: string
};

export async function POST(req: Request) {
    try {

        
        const body = await parseJSON(req) as RequestBody;
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.MEMBER);


        if(IN_DEVELOPMENT_MODE) {
            return Response.json({ disabled: true });
        }

        /*
        * How these work with Quasar:
        * https://github.com/SCE-Development/Quasar/wiki/How-do-Health-Checks-Work%3F
        */

        const result = await fetch(`${LED_SIGN_URL}/api/health-check`)
            .then(res => res.json())
            .catch(() => { throw new InternalServerError(); });

        return Response.json({ result });
    }catch(response) {
        return response;
    }


}