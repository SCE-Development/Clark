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


export async function DELETE(req: Request, { params }: { params: { _id: string } }) {
    try {
        const body = await parseJSON(req).catch(() => ({ token: "abc" }));
        const tokenPayload = await authenticate(body, MEMBERSHIP_STATE.OFFICER);
        
        await Database.connect();
        
        const result = await UserModel.deleteOne({ _id: params._id }).catch(() => { throw new BadRequest() } );
        if (result.deletedCount < 1) {
            return Response.json({ message: `User "${body.email}" was not found.` }, { status: STATUS_CODES.NOT_FOUND });
        }else {
            
            return Response.json({ message: `"${body.email}" was deleted.` }, { status: STATUS_CODES.OK });
        }
    }catch(response) {
        return response;
    }
}