import { AdvertisementModel } from "@/models/Advertisement";
import Database from "@/util/MongoHelper";

type ResponseData = any;

export async function GET(req: Request) {
    try {
        await Database.connect();

        const result = await AdvertisementModel
                                .find()
                                .sort({ createDate: -1 });

        return Response.json({ success: true, result });
    }catch(response) {
        return response;
    }
}