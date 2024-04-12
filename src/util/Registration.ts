/**
 * @note Verifcation JWTs are not able to be revoked. They can only expire.
 * Two verifcation JWTs can be valid at a single time, since the only way
 * to determine an invalid JWT is through the expiration date.
 * This an old verification email with still work, even if a new one is generated,
 * as long as the old verification email has not expired.
 * 
 */

import * as jwt from "jsonwebtoken";
import { BASE_URL, CLOUD_API_SERVER, JWT_SECRET_KEY } from "./Config";
import InternalServerError from "./responses/InternalServerError";
import VerificationExpired from "./responses/VerificationExpired";


/**
 * Data associated with registration.
 */
export interface RegistrationData {
    firstName: string,
    lastName: string,
    email: string,
    encryptedPassword: string,
};


/**
 * Decode a JWT payload from a verification link
 * 
 * @throws {VerificationExpired} Response thrown when the JWT is expired.
 * @throws {InternalServerError} Response thrown if an error occured during decoding.
 * 
 * @param token The JWT passed in the verification link.
 * @returns A promise that resolves with registration data that was associated with the token.
 */
function decode(token : string) : Promise<RegistrationData> {
    return new Promise((res, rej) => {
        jwt.verify(token, JWT_SECRET_KEY, (error, decoded) => {
            if(error) {
                switch(error.name) {
                case "TokenExpiredError":
                    return rej(new VerificationExpired());
                }
                return rej(new InternalServerError());
            }
            return res(decoded as RegistrationData);
        });
    });
}

const VERIFICATION_EXPIRE_DURATION = "5m";

/**
 * Generate a JWT from registration data
 * 
 * @throws {InternalServerError} Response thrown if an error occured during encoding.
 * 
 * @param payload The registration data to encode in the JWT
 * @returns A promise that resolves with the token encoded with the registration data.
 */
function generate(payload : RegistrationData) {
    return new Promise<string>((res, rej) => {
        return jwt.sign(payload, JWT_SECRET_KEY, {
            expiresIn: VERIFICATION_EXPIRE_DURATION
        }, (error, encoded) => {
            if(error) {
                return rej(new InternalServerError());
            }
            return res(encoded as string); 
        });
    });
}

/**
 * Send a verification email with a given registration data.
 * 
 * @throws {InternalServerError} Response thrown if an error occured during JWT encoding.
 * @throws {InternalServerError} Response thrown if an error occured when sending the email.
 * 
 * @param payload The registration data to send in the verification email
 */
async function sendVerificationEmail(payload : RegistrationData) {
    try {
        const token = await generate(payload);
        console.log(token)
        const verificationURL = new URL(`/register/verify`, BASE_URL);
        verificationURL.searchParams.set("token", token);
    
        const body = {
            name: `${payload.firstName} ${payload.lastName}`,
            email: payload.email,
            verifyLink: verificationURL.href
        }
        const result = await fetch(new URL("/v1/mail/send-verification-email", CLOUD_API_SERVER), {
            body: JSON.stringify(body),
            method: "POST",
            headers: {
                "content-type": "application/json"
            }
        }).then((res) => res.json()).catch((e) => { throw new InternalServerError(); });
    }catch(e) {
        console.log(e);
    }
}

/**
 * Server-Side Registration Utilities
 */
const Registration = {
    token: {
        generate, decode
    },
    sendVerificationEmail
};

export default Registration;