import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";


export interface RequestBody {
    token: string,
    alias: string,
};


export async function DELETE(req: Request) {
    try {
        if(!ENABLED) {
            return Response.json({
                disabled: true
            });
        }
        const body = await parseJSON(req) as RequestBody;
        
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.MEMBER);

        if(typeof(body.alias) !== "string") throw new BadRequest();
        const { alias } = body;
        
        const result = await fetch(`${CLEEZY_URL}/delete/${alias}`)
            .catch(() => { throw new InternalServerError(); });
            // .then(res => res.json())    
        
        return new Ok();

    }catch(response) {
        return response;
    }
}