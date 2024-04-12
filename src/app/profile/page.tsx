"use client"

import styles from "./style.module.css";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

interface Profile {
    firstName: string,
    lastName: string,
    joinDate: string,
    email: string,
    emailOptIn: boolean,
    discordUsername: string,
    discordDiscrim: string,
    discordID: string,
    major: string,
    accessLevel: number,
    lastLogin: string,
    membershipValidUntil: string,
    pagesPrinted: number
};

export default function Profile() {

    
    // const profile = await getProfile();
    // console.log(await getSession());
    // console.log(profile)
    
    const [ profile, setProfile ] = useState<Profile|null>(null);

    
    useEffect(() => {
        fetch("/api/v1/user")
            .then(res => res.json())
            .then(res => {
                console.log(res);
                setProfile(res.result)
            })
            .catch(() => {
                
            });
        }, []);
    
    const { status, data } = useSession();
    const displayName = data?.user?.name ?? "N/A";
        

    return <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
        <h1><i>Welcome back,</i> <strong>{displayName}</strong></h1>
        
        {(profile) ? 
            <table className={styles["table"]}>
                <tbody>
                    <tr>
                        <th>First Name</th>
                        <td>{profile.firstName}</td>
                    </tr>
                    <tr>
                        <th>Last Name</th>
                        <td>{profile.lastName}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{profile.email}</td>
                    </tr>
                    <tr>
                        <th>Major</th>
                        <td>{(profile.major ? profile.major : "Unknown")}</td>
                    </tr>
                </tbody>
            </table> :
            <div className={styles["skeleton"]}></div>
        }

        <button onClick={() => {
            signOut({
                callbackUrl: "/"
            });
        }}>Log Out</button>
    </div>
}