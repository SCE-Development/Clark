import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { authenticate } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = any;

export async function POST(req: Request) {
    try {
        const body = await parseJSON(req)
        // .catch(() => ({
        //     token: "abc",
        //     name: "a",
        //     color: "b",
        //     projectType: "c",
        //     url: "d",
        //     contact: "e",
        //     comment: "f",
        //     progress: "g",
        //     email: "h"
        // }))
        const tokenPayload = await authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
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