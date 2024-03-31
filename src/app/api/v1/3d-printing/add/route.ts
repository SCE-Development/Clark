import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = any;

export interface PrintConfig {
    name: string, 
    color: string,
    projectType?: string,
    url?: string,
    contact: string,
    comment?: string,
    email?: string,
    progress?: string,
};

export interface RequestBody {
    print: PrintConfig,
    token: string,
}

export async function POST(req: Request) {
    try {
        const body = await parseJSON(req) as RequestBody;
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
        if(typeof(body.print) !== "object") throw new BadRequest();
        if(typeof(body.print?.name) !== "string") throw new BadRequest();
        if(body.print?.projectType && typeof(body.print?.projectType) !== "string") throw new BadRequest();
        if(body.print?.url && typeof(body.print?.url) !== "string") throw new BadRequest();
        if(typeof(body.print?.contact) !== "string") throw new BadRequest();
        if(body.print?.comment && typeof(body.print?.comment) !== "string") throw new BadRequest();
        if(body.print?.email && typeof(body.print?.email) !== "string") throw new BadRequest();
        if(body.print?.progress && typeof(body.print?.progress) !== "string") throw new BadRequest();
        
        const data = {
            name: body.print.name,
            color: body.print.color,
            projectType: body.print.projectType,
            projectLink: body.print.url,
            projectContact: body.print.contact,
            projectComments: body.print.comment,
            progress: body.print.progress,
            email: body.print.email
        };

        await Database.connect();
        
        const result = await PrintingForm3DModel.create(data).catch((e) => { console.log(e); throw new BadRequest() });

        return Response.json({ success: true, result });
    }catch(response) {
        return response;
    }
}