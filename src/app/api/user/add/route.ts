import { UserModel } from "@/models/User";
import Database from "@/util/MongoHelper";

export async function GET() {
    try {
        const user = new UserModel({
            email: "dfsafd@bfdsa.cd",
            password: "dfjlkdasjfldajlfkds",
            lastName: "fdsjaklfdsjalkfjsd",
            firstName: "fdsjaklfdsjklfds"
        });
        await Database.connect();
        const result = await user.save();
        return Response.json({ result });
    }catch(errorResponse) {
        console.log(errorResponse)
        return errorResponse;
    }
}