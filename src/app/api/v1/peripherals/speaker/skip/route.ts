import { Session } from "@/util/Authenticate";
import { Speaker } from "@/util/Config";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";
import PeripheralNotAvaliable from "@/util/responses/PeripheralNotAvaliable";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    if(!Speaker.enabled) throw new PeripheralNotAvaliable();

    const body = await parseJSON(req);
    const tokenPayload = Session.authenticate(req, body, MEMBERSHIP_STATE.MEMBER);


    const url = new URL("/skip", Speaker.url);

    await fetch(url, {
      method: "POST"
    }).catch(() => {
      throw new InternalServerError();
    });

    return new Ok();
  }catch(response) {
    return response;
  }
}