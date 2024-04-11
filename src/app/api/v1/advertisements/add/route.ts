import { AdvertisementModel } from "@/models/Advertisement";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { authenticate } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";

type ResponseData = any;

export interface Advertisement {
    pictureUrl: string,
    createDate: string,
    expireDate: string
}

export interface RequestBody {
    token: string,
    advertisment: Advertisement
};



/**
 * Create an advertisement
 * This endpoint requires OFFICER authentication.
 * @param req 
 * @returns 
 */
export async function GET(req: Request) {
    try {
        const body = await parseJSON(req) as RequestBody;
        const tokenPayload = await authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
        if(typeof(body.advertisment) !== "object") throw new BadRequest();
        if(typeof(body.advertisment?.pictureUrl) !== "string") throw new BadRequest();
        if(typeof(body.advertisment?.createDate) !== "string") throw new BadRequest();
        if(typeof(body.advertisment?.expireDate) !== "string") throw new BadRequest();

        await Database.connect();

        const newAd = new AdvertisementModel({
            pictureUrl: body.advertisment.pictureUrl,
            createDate: body.advertisment.createDate,
            expireDate: body.advertisment.expireDate
        });

        const result = await newAd.save().catch((e:any) => { console.log(e); throw new BadRequest() });

        return Response.json({ success: true, result });
    }catch(response) {
        return response;
    }
}