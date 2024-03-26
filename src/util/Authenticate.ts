// const jwt = require('jsonwebtoken');
import * as jwt from "jsonwebtoken";
// const { secretKey, DISCORD_PRINTING_KEY } = require('../../config/config.json');
// const passport = require('passport');
// const membershipState = require('../../util/constants').MEMBERSHIP_STATE;


// require('./passport')(passport);
export interface ObjectMaybeWithToken {
  token?: any
};
export interface TokenPayload {
  name: string,
  accessLevel: number,
};

import { MEMBERSHIP_STATE } from "./Constants";
import InternalServerError from "./responses/InternalServerError";
import Unauthorized from "./responses/Unauthorized";
import Unauthenticated from "./responses/Unauthenticated";


export function decodeToken(token : string) : Promise<TokenPayload> {
  // Some kind of logic here;
  console.warn("DEBUG AUTH LOGIC!");

  return new Promise((res, rej) => {
      // Auth logic here.
      if(token === "abc") {
        return res({
          name: "SCE Officer",
          accessLevel: MEMBERSHIP_STATE.OFFICER
        });

      }else {
        return res({
          name: "SCE Not Officer",
          accessLevel: MEMBERSHIP_STATE.NON_MEMBER
        });

      }

      const secretKey = '';
      const userToken = token.replace(/^JWT\s/, '');
      jwt.verify(userToken, secretKey, (error, decoded) => {
        if(error) {
          rej(error);
        }
        res(decoded as TokenPayload);
      });
  });
}

export function authenticate(body : ObjectMaybeWithToken, requiredAccessLevel : number = MEMBERSHIP_STATE.NON_MEMBER) {
  console.log(body.token, requiredAccessLevel);
  return new Promise<string>((res, rej) => {
    console.log(body.token);
    if(body.token === undefined) {
      return rej(new Unauthenticated());
    }
    return res(body.token);
  }).then(async (token) => {
    try {
      return await decodeToken(token);
    }catch(error) {
      // Log error?
      throw new InternalServerError();
    }
  }).then((decoded) => {
    if(decoded.accessLevel < requiredAccessLevel) throw new Unauthorized();
    return decoded;
  });

}
