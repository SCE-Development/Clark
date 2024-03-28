import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import BadRequest from "@/util/responses/BadRequest";
import { UserModel } from "@/models/User";
import { authenticate } from "@/util/Authenticate";
import { parseJSON } from "@/util/ResponseHelpers";
import ItemNotFound from "@/util/responses/ItemNotFound";
import Unauthorized from "@/util/responses/Unauthorized";

type ResponseData = {
    message: string;
};


export async function POST(req: Request, { params }: { params: { _id: string } }) {
    try {
        const _id = params._id;
        const body = await parseJSON(req); // .catch(() => ({ token: "abc", _id: _id }))
        
        const tokenPayload = await authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
        if(tokenPayload._id !== _id) return new Unauthorized();

        await Database.connect();
        
        const result = await UserModel.findOne({ _id: _id }).catch(() => { throw new BadRequest() } );


        if(!result) return new ItemNotFound();
        
        const returned = {
            firstName: result.firstName,
            lastName: result.lastName,
            joinDate: result.joinDate,
            email: result.email,
            emailOptIn: result.emailOptIn,
            discordUsername: result.discordUsername,
            discordDiscrim: result.discordDiscrim,
            discordID: result.discordID,
            major: result.major,
            accessLevel: result.accessLevel,
            lastLogin: result.lastLogin,
            membershipValidUntil: result.membershipValidUntil,
            pagesPrinted: result.pagesPrinted

            // password is omitted
        }
        return Response.json({ returned });

    }catch(response) {
        return response;
    }
}