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

export async function POST(req: Request) {
    try {
        const body = await parseJSON(req);
        const tokenPayload = await Session.authenticate(body);
        if(!(body.updates?.password)) throw new BadRequest();
        
        const password = body.updates.password;
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