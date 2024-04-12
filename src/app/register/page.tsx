import { encryptPassword } from "@/util/Authenticate";
import Registration, { RegistrationData } from "@/util/Registration";
import { permanentRedirect } from "next/navigation";






export default function Register() {
    return (
        <>
            <div style={{display: "grid", gridTemplateColumns: "50% 50%", gridTemplateRows: "100%"}}>
                <div style={{marginRight: "8px"}}>
                    <label htmlFor='firstName'>First Name</label><br/>
                    <input type='text' name='firstName' id='firstName' placeholder="Jane" />
                </div>
                <div style={{marginLeft: "8px"}}>
                    <label htmlFor='lastName'>Last Name</label><br/>
                    <input type='text' name='lastName' id='lastName' placeholder="Doe"/>
                </div>
            </div>
            <div>
                <label htmlFor='email'>Email</label><br/>
                <input type='email' name='email' id='email' placeholder="doe.jane@gmail.com" />
            </div>
            <div>
                <label htmlFor='password'>Password</label><br/>
                <input type='password' name='password' id='password' placeholder="@abf123" />
            </div>
            <button type='submit'>register</button>
        </>
    )
}
