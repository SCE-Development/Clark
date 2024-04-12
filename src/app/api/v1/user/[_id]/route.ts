import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import BadRequest from "@/util/responses/BadRequest";
import { UserModel } from "@/models/User";
import { Session } from "@/util/Authenticate";
import { parseJSON } from "@/util/ResponseHelpers";
import ItemNotFound from "@/util/responses/ItemNotFound";
import Unauthorized from "@/util/responses/Unauthorized";
import { NextRequest } from "next/server";

type ResponseData = {
    message: string;
};


/**
 * Return the info of a user with a given `_id`.
 * This endpoint requires OFFICER authentication.
 * 
 * Password is omitted from the returned info.
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest, { params }: { params: { _id: string } }) {
    try {
        const _id = params._id;
        const body = await parseJSON(req); // .catch(() => ({ token: "abc", _id: _id }))
        
        const tokenPayload = await Session.authenticate(req, body, MEMBERSHIP_STATE.OFFICER);

        await Database.connect();
        
        const result = await UserModel.findOne({ _id: _id }, {
            password: false,
        }).catch(() => { throw new BadRequest() } );


        if(!result) return new ItemNotFound();
        
        return Response.json({ result });

    }catch(response) {
        return response;
    }
}