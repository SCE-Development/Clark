"use client"

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function RegisterVerificationSent() {

    const [ pending, setPending ] = useState(true);
    const [ success, setSuccess ] = useState(false);

    const params = useSearchParams();
    const token = params.get("token");
    
    useEffect(() => {
        if(token == null) {
            setSuccess(false);
            setPending(false);
            return;
        }

        setPending(true);
        setSuccess(false);
        
        fetch(`/api/v1/register/verify?token=${token}`, {})
            .then(() => {
                setSuccess(true);
            }).catch((e) => {
                console.log(e);
                setSuccess(false);
            }).finally(() => {
                setPending(false);
            });
    }, []);

    if(pending)
        return <>
            Verfying...
        </>;

    if(success) 
        return <>
            <p>
                Email verified.
            </p>
            <a href="/log-in">Sign in</a>
        </>;


    return <>
        <p>Something went wrong.</p>
    </>
}