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
        
        const verifyEndpoint = new URL("/api/v1/register/verify");
        verifyEndpoint.searchParams.set("token", token);

        fetch(verifyEndpoint, {})
            .then(() => {
                setSuccess(true);
            }).catch(() => {
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
            Verification successful.
            <a href="/profile">Continue</a>
        </>;


    return <>
        <p>Something went wrong.</p>
    </>
}