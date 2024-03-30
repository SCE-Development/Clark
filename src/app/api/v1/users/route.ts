import { UserModel } from "@/models/User";
import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
  
function clamp(x : number, min: number, max: number) {
    return Math.max(Math.min(x, max), min);
}

export async function POST(req: Request) {
    try {
        const url = new URL(req.url);
        console.log(url.searchParams.get("limit"));
        const body = await parseJSON(req)
        
        const query = {
            limit: body.query?.limit ?? 20,
            skip: body.query?.skip ?? 0,
        };

        query.limit = clamp(query.limit, 1, 30);
        query.skip = clamp(query.skip, 0, Infinity);
        
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.OFFICER);

        // req.header
        console.log(tokenPayload, query);
        const result = await UserModel
            .find({}, {
                password: false,
            }, {
                skip: query.skip,
                limit: query.limit
            })
            .sort({ lastName: -1 }).catch(() => { throw new BadRequest(); });

        return Response.json({
            result
        });
        
    }catch(errorResponse) {
        return errorResponse;
    }
}