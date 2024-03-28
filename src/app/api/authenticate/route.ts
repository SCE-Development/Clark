import { UserModel } from "@/models/User";
import { Session, TokenPayload, comparePassword } from "@/util/Authenticate";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InvalidEmail from "@/util/responses/InvalidEmail";





export async function POST(req : Request) {
    try {
        const body = await parseJSON(req)
        await Database.connect();

        if(!body.email || !body.password) return new BadRequest();

        const email = (body.email as string).toLowerCase();
        const password = body.password as string;

        const user = await UserModel.findOne({ email }).catch(() => { throw new BadRequest(); });
        
        if(!user) throw new InvalidEmail();
        await comparePassword(password, user.password);
        
        const tokenPayload : TokenPayload = {
            _id: user._id,
            accessLevel: user.accessLevel,
            email: user.email,
            name: user.name
        };

        const token = await Session.generateJWT(tokenPayload);

        return Response.json({ 
            token,
            _id: user._id
        });
    }catch(errorResponse) {
        console.log(errorResponse)
        return errorResponse;
    }
}