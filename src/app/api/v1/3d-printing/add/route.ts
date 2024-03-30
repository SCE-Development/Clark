import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = any;

export async function POST(req: Request) {
    try {
        const body = await parseJSON(req);
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
        const data = {
            name: body.name,
            color: body.color,
            projectType: body.projectType,
            projectLink: body.url,
            projectContact: body.contact,
            projectComments: body.comment,
            progress: body.progress,
            email: body.email
        };

        await Database.connect();
        
        const result = await PrintingForm3DModel.create(data).catch((e) => { console.log(e); throw new BadRequest() });

        return Response.json({ success: true, result });
    }catch(response) {
        return response;
    }
}