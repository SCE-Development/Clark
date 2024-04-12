'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {

    // use useSession hook to check login status
    // https://next-auth.js.org/getting-started/client
    const { status, data } = useSession()


    return (
        <div>
            {status === 'authenticated' ?
                <div >locked in as {data.user?.email}</div>
                :
                <div>tweakin</div>
            }
            {status === 'authenticated' ?
                <button className='block' onClick={() => { signOut() }}>sign out</button>
                :
                <button className='block' onClick={() => { signIn() }}>sign in</button>
            }
            <Link href='/register' className="link">register</Link>
        </div>
    )
}
