/**
 * @note Authentication JWTs are not able to be revoked. They can only expire.
 * Two authentication JWTs can be valid at a single time, since the only way
 * to determine an invalid JWT is through the expiration date.
 * 
 */
import * as jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import InternalServerError from "./responses/InternalServerError";
import Unauthorized from "./responses/Unauthorized";
import Unauthenticated from "./responses/Unauthenticated";
import { JWT_SECRET_KEY } from "./Config";
import SessionExpired from "./responses/SessionExpired";
import InvalidPassword from "./responses/InvalidPassword";

export interface ObjectMaybeWithToken {
  token?: any
};

/**
 * Payload from an authentication JWT
 */
export interface TokenPayload {
  name: string,
  accessLevel: number,
  email: string,
  _id: string,
};


/**
 * Decode the payload from an authentication JWT.
 * 
 * @throws {SessionExpired} Response thrown when the JWT is expired.
 * @throws {InternalServerError} Response thrown if an error occured during decoding.
 * 
 * @param token The authentication JWT.
 * @returns A promise that resolves with authentication data that was associated with the token.
 */
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

/**
 * Encrypt a password with the bcrypt library. Hashes and salts the password.
 * The password stored in the database is encrypted. In order to store passwords,
 * encrypt the plaintext password with this function before storing in the database
 * 
 * @throws {InternalServerError} Response thrown if an error occured during encryption.
 * 
 * @param password The plaintext password
 * @returns A promise that resolves with the encrypted password.
 */
export async function encryptPassword(password: string) {
  try {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }catch(error) {
    throw new InternalServerError();
  }
}


/**
 * Match a plaintext password with an encrypted password using the bcrypt library.
 * Use this to verify user-entered passwords with the credentials stored in the database.
 * Resolves if the passwords match, otherwise an error response is thrown.
 * 
 * @throws {InvalidPassword} Response thrown if the input password does not match with the encrypted password.
 * @throws {InternalServerError} Response thrown if an error occured during password verification.
 * 
 * @param inputPassword The inputted plaintext password
 * @param encryptedPassword The encrypted password stored in the database
 * @returns A promise that is resolved if the encrypted input password matches the encrypted database password.
 */
export async function comparePassword(inputPassword: string, encryptedPassword: string) {
  try {
    const isMatch = await bcrypt.compare(inputPassword, encryptedPassword);
    if(!isMatch) throw new InvalidPassword();
    return;
  }catch(error) {
    throw new InternalServerError();
  }
}

/**
 * Decodes a authentication JWT from the request body and determines whether this user has access to a resource.
 * Resolves if the user has access to the resource.
 * 
 * @throws {Unauthenticated} Response thrown if the JSON body does not include a JWT.
 * @throws {InternalServerError} Response thrown if JWT decoding fails.
 * @throws {Unauthorized} Response thrown if the access level of decoded JWT body is lower than `requiredAccessLevel`
 *    AND the _id of the decoded JWT body is not equal to `_id`.
 * @throws {SessionExpired} Response thrown when the JWT is expired.
 * 
 * @param body JSON body from the request, should include a string with the token parameter.
 * @param requiredAccessLevel Required access level to access a resources. Defaults to -Infinity (all access levels allowed)
 * @param _id Allowed _id to access a resource. Defaults to undefined (no specified _id)
 * 
 * @returns A promise that resolves if authentication succeeds, otherwise rejects with one of the aforemetioned errors.
 */
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

/**
 * Generate an authentication JWT from a given authentication information.
 * JWT valid session duration is determined by `SESSION_EXPIRE_DURATION`.
 * 
 * @throws {InternalServerError} Response thrown if an error occured during token generation.
 * 
 * @param payload Authentication information to encode
 * @returns A promise that resolves with the generated JWT. 
 */
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

/**
 * Server-Side Utitlies to handle User Sessions using JWT.
 */
export const Session = {
  authenticate,
  generateJWT
}