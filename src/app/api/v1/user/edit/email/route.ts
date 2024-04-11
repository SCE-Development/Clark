import { UserModel } from "@/models/User";
import { Session, encryptPassword } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import ItemNotFound from "@/util/responses/ItemNotFound";
import Ok from "@/util/responses/Ok";


export interface UserUpdatable {
    discordUsername?: string,
    emailOptIn?: boolean,
    discordDiscrim?: string,
    discordID?: string,
    major?: string,
};

/**
 * Edit the email of the user that is currently authenticated with their authentication JWT.
 * This endpoint requires authentication.
 * 
 * @note Should require more verification (email?)
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
    try {
        const body = await parseJSON(req);
        const tokenPayload = await Session.authenticate(body);
        if(!(body.updates?.email)) throw new BadRequest();
        
        const email = body.updates.email;
        // Possibly resend verification email?

        await Database.connect();
        
        const result = await UserModel.updateOne({ _id: tokenPayload._id }, {
            email
        }).catch(() => { throw new BadRequest();});
        
        if(result.modifiedCount < 1) throw new ItemNotFound();
        return new Ok();
    }catch(errorResponse) {
        console.log(errorResponse);
        return errorResponse;
    }
}