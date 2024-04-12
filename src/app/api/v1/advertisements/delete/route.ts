import { AdvertisementModel } from "@/models/Advertisement";
import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import { NextRequest } from "next/server";

export interface RequestBody {
    token: string,
    _id: string
};



/**
 * Delete an advertisement with a given `_id`
 * This endpoint requires OFFICER authentication.
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest) {
    try {
        const body = await parseJSON(req) as RequestBody;
        const tokenPayload = await Session.authenticate(req, body, MEMBERSHIP_STATE.OFFICER);
        
        await Database.connect();

        if(typeof(body._id) !== "string") throw new BadRequest();
        
        const result = await AdvertisementModel.deleteOne({ _id: body._id }).catch(() => { throw new BadRequest() } );
        if (result.deletedCount < 1) {
            return Response.json({ message: `Advertisement ID "${body._id}" was not found.` }, { status: STATUS_CODES.NOT_FOUND });
        }else {
            
            return Response.json({ message: `"${body._id}" was deleted.` }, { status: STATUS_CODES.OK });
        }
    }catch(response) {
        return response;
    }
}