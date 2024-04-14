import { Session } from "@/util/Authenticate";
import { Speaker } from "@/util/Config";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import Ok from "@/util/responses/Ok";
import PeripheralNotAvaliable from "@/util/responses/PeripheralNotAvaliable";
import { NextRequest } from "next/server";

router.post('/pause', async (req, res) => {
    const { path } = req.route;
    if (!checkIfTokenSent(req)) {
      logger.warn(`${path} was requested without a token`);
      return res.sendStatus(UNAUTHORIZED);
    }
    if (!await verifyToken(req.body.token)) {
      logger.warn(`${path} was requested with an invalid token`);
      return res.sendStatus(UNAUTHORIZED);
    }
    const result = await sendSpeakerRequest(path);
    if (result) {
      return res.sendStatus(OK);
    }
    return res.sendStatus(SERVER_ERROR);
  });




export async function POST(req: NextRequest) {
  try {
    if(!Speaker.enabled) throw new PeripheralNotAvaliable();

    const body = await parseJSON(req);
    const tokenPayload = Session.authenticate(req, body, MEMBERSHIP_STATE.MEMBER);


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