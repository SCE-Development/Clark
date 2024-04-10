'use client'
import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Login() {

    // this is a server action, new with nextjs14. it's code that performs mutations on the backend securely.
    // it also supports server side rendering more.
    // https://blog.logrocket.com/diving-into-server-actions-next-js-14/
    // https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
    async function login(formData: FormData) {
        const signInResponse = await signIn('credentials', {
            email: formData.get('email')!.toString(),
            password: formData.get('password')!.toString(),
            redirect: false
        })

        if (signInResponse!.ok) {
            redirect('/')
        } else {
            console.error(signInResponse!.error);
        }
        redirect('/')
    }

    return (
        <>
            <form action={login}>
                <div>
                    <label htmlFor='email'>Email</label>
                    <input className='border-2 border-black' name='email' type='text' />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input className='border-2 border-black' name='password' type='text' />
                </div>
                <button type='submit'>login</button>
            </form>
        </>
    )
}