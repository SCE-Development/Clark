import { UserModel } from "@/models/User";
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

        return Response.json({ result });
    }catch(errorResponse) {
        console.log(errorResponse)
        return errorResponse;
    }
}