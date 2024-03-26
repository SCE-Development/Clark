import { AdvertisementModel } from "@/models/Advertisement";


import { PrintingForm3DModel } from "@/models/PrintingForm3D";
import { MEMBERSHIP_STATE, STATUS_CODES } from "@/util/Constants";
import Database from "@/util/MongoHelper";
import { parseJSON } from "@/util/ResponseHelpers";
import { authenticate } from "@/util/Authenticate";
import BadRequest from "@/util/responses/BadRequest";
import { UserModel } from "@/models/User";

type ResponseData = {
    message: string;
};


export async function GET(req: Request, { params }: { params: { _id: string } }) {
    try {
        const _id = params._id;
        // const body = await parseJSON(req).catch(() => ({ token: "abc", _id: _id }))
        // const { email } = body;
        // if (!email) throw new BadRequest();
        
        // const tokenPayload = await authenticate(body, MEMBERSHIP_STATE.OFFICER);

        await Database.connect();
        
        const result = await UserModel.findOne({ _id: _id }).catch(() => { throw new BadRequest() } );
        if(result) return Response.json({ exists: true, result }, { status: STATUS_CODES.CONFLICT });
        return Response.json({ exists: false });

    }catch(response) {
        return response;
    }
}