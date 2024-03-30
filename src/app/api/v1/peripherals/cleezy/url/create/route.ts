
router.post('/createUrl', async (req, res) => {
    if (!checkIfTokenSent(req)) {
      return res.sendStatus(FORBIDDEN);
    } else if (!await verifyToken(req.body.token)) {
      return res.sendStatus(UNAUTHORIZED);
    }
    const { url, alias } = req.body;
    let jsonbody = { url, alias: alias || null };
    try {
      const response = await axios.post(CLEEZY_URL + '/create_url', jsonbody);
      const data = response.data;
      const u = new URL( data.alias, URL_SHORTENER_BASE_URL);
      res.json({ ...data, link: u });
    } catch (err) {
      logger.error('/createUrl had an error', err);
      res.status(err.response.status).json({ error: err.response.status });
    }
  });

import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import BadRequest from "@/util/responses/BadRequest";
import InternalServerError from "@/util/responses/InternalServerError";
import Ok from "@/util/responses/Ok";

export async function POST(req: Request) {
    try {
        if(!ENABLED) {
            return Response.json({
                disabled: true
            });
        }
        const body = await parseJSON(req);
        
        const tokenPayload = await Session.authenticate(body, MEMBERSHIP_STATE.MEMBER);

        const { alias } = body;
        if(!alias || typeof(alias) === "string") throw new BadRequest();

        const result = await fetch(`${CLEEZY_URL}/create_url`, {
            
        })
            .catch(() => { throw new InternalServerError(); });
            // .then(res => res.json())    
        
        return new Ok();

    }catch(response) {
        return response;
    }
}