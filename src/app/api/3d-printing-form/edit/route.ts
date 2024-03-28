import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { Session } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = {
    message: string;
};


export async function POST(req: Request) {
    try {
        const body = await parseJSON(req).catch(() => ({ token: "abc", _id: "6601e0f271f5fd4eed922822" }))
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.OFFICER);

        const query = { email: body.email, date: body.date };
        const form = {
          ...body
        };

        // Remove the auth token from the form getting edited
        delete form.token;
        
        await Database.connect();
        
        const result = await PrintingForm3DModel.updateOne(query, { ...form }).catch(() => { throw new BadRequest() } );
        if (result.modifiedCount < 1) {
            return Response.json({ message: `Form ID "${body._id}" was not found.` }, { status: STATUS_CODES.NOT_FOUND });
        }else {
            
            return Response.json({ message: `"${body._id}" was updated.` }, { status: STATUS_CODES.OK });
        }
    }catch(response) {
        return response;
    }
}