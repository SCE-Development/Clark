import { Session } from "@/util/Authenticate";
import { MEMBERSHIP_STATE } from "@/util/Constants";
import { parseJSON } from "@/util/ResponseHelpers";
import { CLEEZY_URL } from "../config";
import InternalServerError from "@/util/responses/InternalServerError";
import { NextRequest } from "next/server";

// const ROWS_PER_PAGE = 20;


export interface RequestBody {
    token: string
};


export async function POST(req: NextRequest) {
    try {
        if(!ENABLED) {
            return Response.json({
                disabled: true
            });
        }
        const url = new URL(req.url);
        const page = url.searchParams.get("page") ?? 0;
        const search = url.searchParams.get("search") ?? null;
        const body = await parseJSON(req);
        
        const tokenPayload = await Session.authenticate(req, body, MEMBERSHIP_STATE.MEMBER);

        const query = "?" + (search ? `search=${search}` : "") + `page=${page}`;

        const response = await fetch(`${CLEEZY_URL}/list${query}`, {
            headers: {
                "content-type": "application/json"
            }
        }).then(res => res.json()).catch(() => { throw new InternalServerError(); });

        const { aliases = [], total, rows_per_page: rowsPerPage } = response.data;
        const data = aliases.map((element : { alias: string, }) => {
          const u = new URL(element.alias, URL_SHORTENER_BASE_URL);
          return { ...element, link: u.href };
        });
        return Response.json({ data, total, rowsPerPage });

    }catch(response) {
        return response;
    }
}