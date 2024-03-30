import { AdvertisementModel } from "@/models/Advertisement";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { authenticate } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = any;

export async function GET(req: Request) {
    try {
        const body = await parseJSON(req)
        .catch(() => ({
            token: "abc",
            pictureUrl: "DAsfsadfdsaf",
            createDate: Date.now(),
            expireDate: Date.now(),
        }))
        // const tokenPayload = await authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
        await Database.connect();

        const newAd = new AdvertisementModel({
            pictureUrl: body.pictureUrl,
            createDate: body.createDate,
            expireDate: body.expireDate
        });

        const result = await newAd.save().catch((e) => { console.log(e); throw new BadRequest() });

        return Response.json({ success: true, result });
    }catch(response) {
        return response;
    }
}