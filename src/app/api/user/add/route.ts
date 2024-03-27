import { UserModel } from "@/models/User";
import Fake from "@/util/Fake";
import Database from "@/util/MongoHelper";

// export async function GET() {
//     try {
//         const user = new UserModel({
//             email: Fake.email(),
//             password: Fake.password(),
//             lastName: Fake.name(),
//             firstName: Fake.name(),
//         });
//         await Database.connect();
//         const result = await user.save();
//         return Response.json({ result });
//     }catch(errorResponse) {
//         console.log(errorResponse)
//         return errorResponse;
//     }
// }