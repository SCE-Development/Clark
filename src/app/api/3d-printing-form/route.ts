
import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { DATABASE_DOWN, INTERNAL_SERVER_ERROR, parseJSON } from "@/util/ResponseHelpers";
import { authenticate } from "@/util/Authenticate";
import { HydratedArraySubdocument, HydratedDocument } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";

type ResponseData = any; // What the fuck is the return type.

export async function GET(req: Request) {
    try {
        const body = await parseJSON(req).catch(() => ({}));
        
        let obj = {};
        if (typeof body.email !== 'undefined') obj = { email: body.email };
        
        await Database.connect();
        
        const forms = await PrintingForm3DModel.find(obj).exec().catch(() => { throw BAD_REQUEST });
        
        return Response.json(forms);
    }catch(errorResponse) {
        console.log(errorResponse);
        return errorResponse;
    }
}