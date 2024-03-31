import { UserModel } from "@/models/User";
import { Session, TokenPayload, comparePassword } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InvalidEmail from "@/util/responses/InvalidEmail";
import UserBanned from "@/util/responses/UserBanned";
import UserEmailUnverified from "@/util/responses/UserEmailUnverified";



export interface RequestBody {
    email: string,
    password: string,
};


export async function POST(req : Request) {
    try {
        const body = await parseJSON(req) as RequestBody;
        await Database.connect();
    
        if(typeof(body.email) !== "string") throw new BadRequest();
        if(typeof(body.password) !== "string") throw new BadRequest();

        const email = body.email.toLowerCase();
        const password = body.password;

        const user = await UserModel.findOne({ email }).catch(() => { throw new BadRequest(); });
        
        if(!user) throw new InvalidEmail();
        await comparePassword(password, user.password);

        if(user.accessLevel === MEMBERSHIP_STATE.BANNED) throw new UserBanned();
        if(!user.emailVerified) throw new UserEmailUnverified();
        
        const tokenPayload : TokenPayload = {
            _id: user._id,
            accessLevel: user.accessLevel,
            email: user.email,
            name: user.name
        };

        const token = await Session.generateJWT(tokenPayload);

        return Response.json({ 
            token
        });
    }catch(errorResponse) {
        console.log(errorResponse)
        return errorResponse;
    }
}