// const jwt = require('jsonwebtoken');
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
export interface ObjectMaybeWithToken {
  token?: any
};
export interface TokenPayload {
  name: string,
  accessLevel: number,
  email: string,
  _id: string,
};

import InternalServerError from "./responses/InternalServerError";
import Unauthorized from "./responses/Unauthorized";
import Unauthenticated from "./responses/Unauthenticated";
import { JWT_SECRET_KEY } from "./Config";
import SessionExpired from "./responses/SessionExpired";
import InvalidPassword from "./responses/InvalidPassword";


export function decodeToken(token : string) : Promise<TokenPayload> {

  return new Promise((res, rej) => {
      jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
        if(error) {
          switch(error.name) {
          case "TokenExpiredError":
            return rej(new SessionExpired());
          }
          return rej(new InternalServerError());
        }
        return res(decoded as TokenPayload);
      });
  });
}

export async function encryptPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }catch(error) {
    throw new InternalServerError();
  }
}


export async function comparePassword(inputPassword: string, encryptedPassword: string) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, encryptedPassword);
    if(!isMatch) throw new InvalidPassword();
    return;
  }catch(error) {
    throw new InternalServerError();
  }
}

function authenticate(body : ObjectMaybeWithToken, requiredAccessLevel : number = -Infinity, _id : string|undefined = undefined) {
  console.log(body.token, requiredAccessLevel);
  return new Promise<string>((res, rej) => {
      console.log(body.token);
      if(body.token === undefined) {
        return rej(new Unauthenticated());
      }
      return res(body.token);
    })
    .then(decodeToken)
    .then((decoded) => {
      if(_id && decoded._id === _id) return decoded;
      if(decoded.accessLevel < requiredAccessLevel) throw new Unauthorized();
      return decoded;
    });

}

const SESSION_EXPIRE_DURATION = "2h";

function generateJWT(payload : TokenPayload) {
  return new Promise<string>((res, rej) => {
    return jwt.sign(payload, JWT_SECRET_KEY, {
      expiresIn: SESSION_EXPIRE_DURATION
    }, (error, encoded) => {
      if(error) {
        return rej(new InternalServerError());
      }
      return res(encoded as string); 
    });
  });
}

export const Session = {
  authenticate,
  generateJWT
}