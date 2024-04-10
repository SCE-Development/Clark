import { encryptPassword } from "@/util/Authenticate";
import Registration, { RegistrationData } from "@/util/Registration";
import { permanentRedirect } from "next/navigation";






export default function Register() {
    
    // this is a server action, new with nextjs14. it's code that performs mutations on the backend securely.
    // it also supports server side rendering more.
    // https://blog.logrocket.com/diving-into-server-actions-next-js-14/
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
    async function register(formData: FormData) {
        "use server"

        const encryptedPassword = await encryptPassword(formData.get('password')!.toString())

        const data : RegistrationData = {
            email: formData.get('email')!.toString(),
            encryptedPassword,
            firstName: formData.get('firstName')!.toString(),
            lastName: formData.get('lastName')!.toString(),
        };

        await Registration.sendVerificationEmail(data);

        // await prismaClient.user.create({
        //     data: {
        //         email: formData.get('email')!.toString(),
        //         password: formData.get('password')!.toString(),
        //         firstName: formData.get('firstName')!.toString(),
        //         lastName: formData.get('lastName')!.toString(),
        //         major: 'CS'
        //     }
        // })

        permanentRedirect("/register/verify");
    }

    return (
        <>
            <form action={register} className=''>
                <div>
                    <label htmlFor='email'>email</label>
                    <input type='text' name='email' id='email' />
                </div>
                <div>
                    <label htmlFor='password'>password</label>
                    <input type='text' name='password' id='password' />
                </div>
                <div>

                    <label htmlFor='firstName'>firstName</label>
                    <input type='text' name='firstName' id='firstName' />
                </div>
                <div>
                    <label htmlFor='lastName'>lastName</label>
                    <input type='text' name='lastName' id='lastName' />
                </div>
                <button type='submit'>register</button>
            </form>
        </>
    )
}
