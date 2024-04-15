import { Session } from "@/util/Authenticate";
import { Speaker } from "@/util/Config";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";
import PeripheralNotAvaliable from "@/util/responses/PeripheralNotAvaliable";
import { NextRequest } from "next/server";



export async function POST(req: NextRequest) {
    try {
      if(!Speaker.enabled) throw new PeripheralNotAvaliable();
  
      const body = await parseJSON(req);
      const tokenPayload = Session.authenticate(req, body, MEMBERSHIP_STATE.MEMBER);
      
      if(typeof(body.url) !== "string") throw new BadRequest();

      const url = new URL("/stream", Speaker.url);
  
      await fetch(url, {
        method: "POST",
        body: JSON.stringify({
            url: body.url
        }),
        headers: {
            "content-type": "application/json"
        }
      }).catch(() => {
        throw new InternalServerError();
      });
  
      return new Ok();
    }catch(response) {
      return response;
    }
  }