import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { Session } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";
import { UserModel } from "@/models/User";
import ItemNotFound from "@/util/responses/ItemNotFound";
import { NextRequest } from "next/server";

type ResponseData = {
    message: string;
};



/**
 * Delete the user that is currently authenticated with their authentication JWT.
 * This endpoint requires authentication.
 * 
 * @note Should require more verification (email?)
 * 
 * @param req 
 * @returns 
 */
export async function DELETE(req: NextRequest, { params }: { params: { _id: string } }) {
    try {
        const _id = params._id;
        const body = await parseJSON(req); // .catch(() => ({ token: "abc", _id: _id }))
        
        const tokenPayload = await Session.get(req, body);

        await Database.connect();
        
        // prob should do more than just this.
        const result = await UserModel.deleteOne({ _id: _id }).catch(() => { throw new BadRequest() } );
        console.log(result);
        if (result.deletedCount < 1) {
            throw new ItemNotFound();
        }else {
            
            return Response.json({ message: `"${body.email}" was deleted.` }, { status: STATUS_CODES.OK });
        }
    }catch(response) {
        return response;
    }
}