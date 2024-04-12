import Registration, { RegistrationData } from "@/util/Registration";
import styles from "./style.module.css"
import { permanentRedirect } from "next/navigation";
import { encryptPassword } from "@/util/Authenticate";
import Link from "next/link";
import Database from "@/util/MongoHelper";
import { UserModel } from "@/models/User";

export default function RegisterFormLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {

    
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

      await Database.connect();
      const result = await UserModel.findOne({ email: data.email });
      if(result) return;

      await Registration.sendVerificationEmail(data);

      permanentRedirect("/register/verification-sent");
  }

    return <div className={styles["form-container"]}>
        <form action={register}>
          {children}
        </form>
    </div>;
  }
  
