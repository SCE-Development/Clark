import prismaClient from "@/lib/prisma";
import { z } from "zod"

/**
 * Creates a user.
 * @param req 
*/
export async function POST(req: Request) {
    const formData = await req.formData()
    const recaptchaResponse = formData.get('recaptchaResponse')

    // validate recaptcha
    const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${recaptchaResponse}`,
        { method: 'POST' }
    )

    // if recaptcha is valid, create user
    if (res.ok) {
        try {
            const firstName = z.string().parse(formData.get('firstName'))
            const lastName = z.string().parse(formData.get('lastName'))
            const email = z.string().parse(formData.get('email'))
            const password = z.string().parse(formData.get('password'))
            const major = z.string().parse(formData.get('major'))
            const plan = z.string().parse(formData.get('plan'))
            prismaClient.user.create({
                data: {
                    email: email,
                    password: password,
                    firstName: firstName,
                    lastName: lastName,
                    major: major,
                }
            })
        } catch (e) {
            console.log(e)
            return new Response('Invalid form data', { status: 400 })
        }
    } else {
        return new Response('Recaptcha failed', { status: 400 })
    }
}