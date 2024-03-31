import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InternalServerError from "@/util/responses/InternalServerError";



export interface RequestBody {
    token: string,
    url: string,
    alias?: string,
};



export async function POST(req: Request) {
    try {
        if(!ENABLED) {
            return Response.json({
                disabled: true
            });
        }
        const body = await parseJSON(req) as RequestBody;
        
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.MEMBER);

        if(typeof(body.url) !== "string") throw new BadRequest();
        if(body.alias && typeof(body.alias) !== "string") throw new BadRequest();
        const { url, alias } = body;
        const result = await fetch(`${CLEEZY_URL}/create_url`, {

            body: JSON.stringify({
                url,
                alias
            })
        })
            .then(res => res.json())
            .catch(() => { throw new InternalServerError(); });
            
        return Response.json({ result, url: new URL(result.alias, URL_SHORTENER_BASE_URL) });

    }catch(response) {
        return response;
    }
}