import { NextRequest } from "next/server";
import { POST } from "../../../3d-printing/route";
import { parseJSON } from "@/util/ResponseHelpers";
import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import BadRequest from "@/util/responses/BadRequest";
import { Printer } from "../config";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";
import PeripheralNotAvaliable from "@/util/responses/PeripheralNotAvaliable";


export interface RequestBody {
  raw: any,
  copies: number,
  pageRanges: any,
  sides: any,
  token?: string,
}


export async function POST(req: NextRequest) {
  try {
    if(!Printer.enabled) throw new PeripheralNotAvaliable();

    const body = await parseJSON(req) as RequestBody;
    const tokenPayload = Session.authenticate(req, body, MEMBERSHIP_STATE.MEMBER);

    if(body.raw == null) throw new BadRequest();
    if(typeof(body.copies) === "number") throw new BadRequest();
    if(body.pageRanges == null) throw new BadRequest();
    if(body.sides == null) throw new BadRequest();

    const { raw, copies, pageRanges, sides } = body;

    const url = new URL("/print", Printer.url);

    await fetch(url, {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        raw, copies, pageRanges, sides
      })
    }).catch(() => {
      throw new InternalServerError();
    });

    return new Ok();
  }catch(response) {
    return response;
  }
}
