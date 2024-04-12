import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import BadRequest from "@/util/responses/BadRequest";
import { UserModel } from "@/models/User";
import { Session } from "@/util/Authenticate";
import { parseJSON } from "@/util/ResponseHelpers";
import ItemNotFound from "@/util/responses/ItemNotFound";
import Unauthorized from "@/util/responses/Unauthorized";
import { NextRequest } from "next/server";

type ResponseData = {
    message: string;
};


/**
 * Return the info of the user that is currently authenticated with their authentication JWT.
 * This endpoint requires authentication.
 * 
 * Password and database id is omitted from the returned info.
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: NextRequest) {
    try {
        const body = await parseJSON(req);
        
        const tokenPayload = await Session.get(req, body);

        await Database.connect();
        
        const user = await UserModel.findOne({ _id: tokenPayload._id }, {
            _id: false,
            password: false,
        }).catch(() => { throw new BadRequest() } );


        if(!user) return new ItemNotFound();
        
        const result = {
            firstName: user.firstName,
            lastName: user.lastName,
            joinDate: user.joinDate,
            email: user.email,
            emailOptIn: user.emailOptIn,
            discordUsername: user.discordUsername,
            discordDiscrim: user.discordDiscrim,
            discordID: user.discordID,
            major: user.major,
            accessLevel: user.accessLevel,
            lastLogin: user.lastLogin,
            membershipValidUntil: user.membershipValidUntil,
            pagesPrinted: user.pagesPrinted

            // password is omitted
        }
        return Response.json({ result });

    }catch(response) {
        return response;
    }
}

/**
 * Return the info of the user that is currently authenticated with their authentication JWT.
 * This endpoint requires authentication.
 * 
 * Password and database id is omitted from the returned info.
 * 
 * @param req 
 * @returns 
 */
export async function GET(req: NextRequest) {
    try {
        const tokenPayload = await Session.get(req, {});

        await Database.connect();
        
        const user = await UserModel.findOne({ _id: tokenPayload._id }, {
            _id: false,
            password: false,
        }).catch(() => { throw new BadRequest() } );


        if(!user) return new ItemNotFound();
        
        const result = {
            firstName: user.firstName,
            lastName: user.lastName,
            joinDate: user.joinDate,
            email: user.email,
            emailOptIn: user.emailOptIn,
            discordUsername: user.discordUsername,
            discordDiscrim: user.discordDiscrim,
            discordID: user.discordID,
            major: user.major,
            accessLevel: user.accessLevel,
            lastLogin: user.lastLogin,
            membershipValidUntil: user.membershipValidUntil,
            pagesPrinted: user.pagesPrinted

            // password is omitted
        }
        return Response.json({ result });

    }catch(response) {
        return response;
    }
}