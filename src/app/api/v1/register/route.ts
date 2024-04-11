

import { UserModel } from "@/models/User";
import { encryptPassword } from "@/util/Authenticate";
import Database from "@/util/MongoHelper";
import Registration, { RegistrationData } from "@/util/Registration";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import EmailConflict from "@/util/responses/EmailConflict";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";



export interface RequestBody {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
};

export async function POST(req: Request) {
    try {
        const body = await parseJSON(req) as RequestBody;

        if(typeof(body.firstName) !== "string") throw new BadRequest();
        if(typeof(body.lastName) !== "string") throw new BadRequest();
        if(typeof(body.email) !== "string") throw new BadRequest();
        if(typeof(body.password) !== "string") throw new BadRequest();
        await Database.connect();
        const result = await UserModel.findOne({ email: body.email }).catch((e) => { throw new InternalServerError(); });
        if(result) throw new EmailConflict();

        const payload : RegistrationData = {
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            encryptedPassword: await encryptPassword(body.password)
        };
        

        await Registration.sendVerificationEmail(payload);
        return new Ok();
    }catch(response) {
        return response;
    }
}