
import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = any; // What the fuck is the return type.

interface RequestBody {
    email?: string;
}

/**
 * Get all 3d print requests in the database.
 * This endpoint does NOT require authentication.
 * 
 * @param req 
 * @returns 
 */
export async function GET(req: Request) {
    try {
        
        let query = {};
        
        await Database.connect();
        
        const forms = await PrintingForm3DModel.find(query).exec().catch(() => { throw new BadRequest() });
        
        return Response.json(forms);
    }catch(errorResponse) {
        console.log(errorResponse);
        return errorResponse;
    }
}

/**
 * Get all 3d print requests in the database.
 * This endpoint does NOT require authentication.
 * 
 * You are able to filter by email
 * 
 * @param req 
 * @returns 
 */
export async function POST(req: Request) {
    try {
        const body = await parseJSON(req) as RequestBody;
        
        let query = {};
        if (typeof body.email !== 'undefined') query = { email: body.email };
        
        await Database.connect();
        
        const forms = await PrintingForm3DModel.find(query).exec().catch(() => { throw new BadRequest() });
        
        return Response.json(forms);
    }catch(errorResponse) {
        console.log(errorResponse);
        return errorResponse;
    }
}