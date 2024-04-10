'use client'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function Home() {

    // use useSession hook to check login status
    // https://next-auth.js.org/getting-started/client
    const { status, data } = useSession()

    console.log(data)

    return (
        <>
            {status === 'authenticated' ?
                <div className='bg-green-500'>locked in as {data.user?.email}</div>
                :
                <div className='bg-red-500'>tweakin</div>
            }
            {status === 'authenticated' ?
                <button className='block' onClick={() => { signOut() }}>sign out</button>
                :
                <button className='block' onClick={() => { signIn() }}>sign in</button>
            }
            <Link href='/register'>register</Link>
        </>
    )
}
