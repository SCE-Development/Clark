import * as jwt from "jsonwebtoken";
import { BASE_URL, CLOUD_API_SERVER, JWT_SECRET_KEY } from "./Config";
import InternalServerError from "./responses/InternalServerError";
import VerificationExpired from "./responses/VerificationExpired";


export interface RegistrationData {
    firstName: string,
    lastName: string,
    email: string,
    encryptedPassword: string,
};


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

const VERIFICATION_EXPIRE_DURATION = "5M";

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

async function sendVerificationEmail(payload : RegistrationData) {
    const token = await generate(payload);
    const verificationURL = new URL(`/v1/register/verify`, BASE_URL);
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
    }).then((res) => res.json());
}

const Registration = {
    token: {
        generate, decode
    },
    sendVerificationEmail
};

export default Registration;