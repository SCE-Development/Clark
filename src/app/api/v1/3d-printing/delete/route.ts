import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { Session } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";
import { NextRequest } from "next/server";

type ResponseData = {
    message: string;
};



export interface RequestBody {
    _id: string
    token: string,
}

/**
 * Remove a 3d print request from the database.
 * This endpoint requires OFFICER authentication.
 * 
 * @param req 
 * @returns 
 */

export async function POST(req: NextRequest) {
    try {
        const body = await parseJSON(req) as RequestBody;
        const tokenPayload = await Session.authenticate(req, body, MEMBERSHIP_STATE.OFFICER);
        
        await Database.connect();

        if(typeof(body._id) !== "string") throw new BadRequest();
        
        const result = await PrintingForm3DModel.deleteOne({ _id: body._id }).catch(() => { throw new BadRequest() } );
        if (result.deletedCount < 1) {
            return Response.json({ message: `Form ID "${body._id}" was not found.` }, { status: STATUS_CODES.NOT_FOUND });
        }else {
            
            return Response.json({ message: `"${body._id}" was deleted.` }, { status: STATUS_CODES.OK });
        }
    }catch(response) {
        return response;
    }
}