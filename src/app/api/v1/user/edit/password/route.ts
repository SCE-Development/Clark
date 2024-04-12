import { UserModel } from "@/models/User";
import { Session, encryptPassword } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import ItemNotFound from "@/util/responses/ItemNotFound";
import Ok from "@/util/responses/Ok";
import { NextRequest } from "next/server";

export interface ResponseBody {
    token: string;
    password: string;
};

/**
 * Edit the password of the user that is currently authenticated with their authentication JWT.
 * This endpoint requires authentication.
 * 
 * @note Should require more verification (email?)
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest) {
    try {
        const body = (await parseJSON(req)) as ResponseBody;
        const tokenPayload = await Session.get(req, body);
        if(typeof(body.password) !== "string") throw new BadRequest();
        
        const password = body.password;
        // Possibly send verification email?
        const hashed = await encryptPassword(password);

        await Database.connect();
        
        const result = await UserModel.updateOne({ _id: tokenPayload._id }, {
            password: hashed
        }).catch(() => { throw new BadRequest();});
        
        if(result.modifiedCount < 1) throw new ItemNotFound();
        return new Ok();
    }catch(errorResponse) {
        console.log(errorResponse);
        return errorResponse;
    }
}