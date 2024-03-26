
// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'

import { STATUS_CODES } from "@/util/Constants";
import { TokenPayload, authenticate } from "@/util/Authenticate";
import { NextApiRequest, NextApiResponse } from "next";

// Returns the name and accesslevel of the user w/ the given access token
export async function handler(req : NextApiRequest, res : NextApiResponse<TokenPayload>) {
    // Want any token, even banned members with negative access level.
    const token = await authenticate(req, res, -Infinity);
    if(!token) return;
    res.status(STATUS_CODES.OK).json(token);
}