/// TODO LATER

// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import InternalServerError from "@/util/responses/InternalServerError";

// const Schema = mongoose.Schema;

// const OneTimePasscodeSchema = new Schema(
//     {
//         userId: {
//             type: String,
//             required: true,
//             unique: true,
//         },
//         passcode : {
//             type: String,
//             required: true,
//         },
//         expireAfterSeconds: {
//             type: Number,
//             required: true,
//         }
//     },
//     { collection: 'Advertisements' }
// );
// export const OneTimePasscodeModel = mongoose.models.OneTimePasscode || mongoose.model('OneTimePasscode', OneTimePasscodeSchema);

// const FIVE_MINUTES = 5 * 60;
// const OneTimePasscode = {
//     async generate(userId : string, passcode: string, expireAfterSeconds: number = FIVE_MINUTES) {
//         try {
//             const salt = await bcrypt.genSalt(10);
//             const hashed = await bcrypt.hash(passcode, salt);

//             OneTimePasscodeModel.insertMany([{
//                 userId,
//                 passcode: hashed,
//                 expireAfterSeconds
//             }]);
//         }catch(error) {
//             throw new InternalServerError();
//         }
//     },
//     // async revoke(userId : string) {

//     // },
//     // async regenerate(userId : String, expireAfterSeconds: number = FIVE_MINUTES) {

//     // },
//     async verify(userId: string, passcode: string) {
//         try {
//             const salt = await bcrypt.genSalt(10);
//             const hashed = await bcrypt.hash(passcode, salt);
//             OneTimePasscodeModel.find
//             OneTimePasscodeModel.insertMany([{
//                 userId,
//                 passcode: hashed,
//                 expireAfterSeconds
//             }]);
//         }catch(error) {
//             throw new InternalServerError();
//         }
//     }
// }

// export default OneTimePasscode;