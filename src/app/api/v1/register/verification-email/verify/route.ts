

import { UserModel } from "@/models/User";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import Registration, { RegistrationData } from "@/util/Registration";
import BadRequest from "@/util/responses/BadRequest";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const token = url.searchParams.get("token");
        if(!token) throw new BadRequest();

        const payload = await Registration.token.decode(token);
        const user = new UserModel({
            email: payload.email,
            password: payload.encryptedPassword,
            accessLevel: MEMBERSHIP_STATE.OFFICER,
            lastName: payload.lastName,
            firstName: payload.firstName,
        });
        await Database.connect();
        
        const result = await user.save();
        return Response.json({ success: true });
    }catch(response) {
        return response;
    }
}