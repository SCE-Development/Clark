

import { UserModel } from "@/models/User";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import Registration from "@/util/Registration";
import BadRequest from "@/util/responses/BadRequest";
import EmailConflict from "@/util/responses/EmailConflict";
import InternalServerError from "@/util/responses/InternalServerError";
import { NextRequest } from "next/server";


/**
 * Address verification endpoint.
 * Once this endpoint is visited, the user will be added to the database.
 * This endpoint does NOT requires authentication.
 * 
 * @throws {EmailConflict} if the email is already in the database. THIS SHOULD NOT HAPPEN.
 * 
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");
        if(!token) throw new BadRequest();

        const payload = await Registration.token.decode(token);

        await Database.connect();
        const result = await UserModel.findOne({ email: payload.email }).catch((e) => { throw new InternalServerError(); });
        
        // SOMETHING BAD HAS HAPPENED. USER VERIFIED TWICE? WHY WAS A VERIFICATION EMAIL SENT IF THE EMAIL IS ALREADY REGISTERED?
        if(result) throw new EmailConflict();

        const user = new UserModel({
            email: payload.email,
            password: payload.encryptedPassword,
            accessLevel: MEMBERSHIP_STATE.OFFICER,
            lastName: payload.lastName,
            firstName: payload.firstName,
            emailVerified: true
        });
        await user.save().catch((e : any) => { console.log(e); throw new InternalServerError(); });
        return Response.json({ success: true });
    }catch(response) {
        return response;
    }
}