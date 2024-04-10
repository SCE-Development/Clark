'use client'
import { signIn } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function Login() {

    // this is NOT a server action. signIn is a client side method only, and cannot be used in a server action.
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