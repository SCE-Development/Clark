import { createContext, useContext } from "react";


interface Session {
    token: string|null;
    setToken: (token:string)=>void;
};

const SessionContext = createContext<Session>({
    token: null,
    // signIn(){},
    setToken(token:string){},
    // logOut(){},
});


export const SessionContextProvider = SessionContext.Provider;
export function useSession() {
    return useContext(SessionContext);
}