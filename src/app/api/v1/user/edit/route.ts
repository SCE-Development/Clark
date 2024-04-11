import { UserModel } from "@/models/User";
import { Session, encryptPassword } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import ItemNotFound from "@/util/responses/ItemNotFound";
import Ok from "@/util/responses/Ok";

export interface UserUpdatable {
    firstName?: string,
    lastName?: string,
    discordUsername?: string,
    emailOptIn?: boolean,
    discordDiscrim?: string,
    discordID?: string,
    major?: string,
};

const UPDATABLE = [
    {
        key: "firstName",
        type: "string"
    },
    {
        key: "lastName",
        type: "string"
    },
    {
        key: "discordUsername",
        type: "string"
    },
    {
        key: "emailOptIn",
        type: "string"
    },
    {
        key: "discordDiscrim",
        type: "string"
    },
    {
        key: "discordID",
        type: "string"
    },
    {
        key: "major",
        type: "string"
    }
]


/**
 * Edit the info of the user that is currently authenticated with their authentication JWT.
 * This endpoint requires authentication.
 * 
 * Only `firstName`, `lastName`, `discordUsername`, `emailOptIn`, `discordDiscrim`, `discordID`, and `major` are editable from this endpoint.
 * Fields not specified will keep their original values in the database.
 * Fields specified will be updated.
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
    try {
        const body = await parseJSON(req);
        const tokenPayload = await Session.authenticate(body);

        if(!body.updates) throw new BadRequest();
        // Fill the updates and verify types
        const updates : any = {};
        UPDATABLE.forEach(({key, type}) => {
            if(body.updates[key])
                if(typeof(body.updates[key]) === type) updates[key] = body.updates[key];
                else throw new BadRequest();
        });

        await Database.connect();
        
        const result = await UserModel.updateOne({ _id: tokenPayload._id }, updates).catch(() => { throw new BadRequest();});
        
        if(result.modifiedCount < 1) throw new ItemNotFound();
        return new Ok();
    }catch(errorResponse) {
        console.log(errorResponse);
        return errorResponse;
    }
}