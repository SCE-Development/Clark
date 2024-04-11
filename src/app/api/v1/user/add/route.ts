import { UserModel } from "@/models/User";
import { encryptPassword } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Fake from "@/util/Fake";
import Database from "@/util/MongoHelper";


/**
 * Add debug users.
 * 
 */
// export async function GET() {
//     try {
//         const password = "abcde";
        
//         const encryptedPassword = await encryptPassword(password);

//         const user = new UserModel({
//             email: "e@f.g",
//             password: encryptedPassword,
//             accessLevel: MEMBERSHIP_STATE.OFFICER,
//             lastName: "Dank",
//             firstName: "John",
//         });
//         await Database.connect();
        
//         const result = await user.save();
//         return Response.json({ result });
//     }catch(errorResponse) {
//         console.log(errorResponse)
//         return errorResponse;
//     }
// }