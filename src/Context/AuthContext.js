import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";

const UserAuthContext = createContext({});

export  const UserAuthContextProvider = ({ children }) =>{
    const [user,setUser] = useState("");
    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(currentUser)=> setUser(currentUser));
        return () => unsub()
    },[])
    return(
        <UserAuthContext.Provider value={{user}}>
            { children }
        </UserAuthContext.Provider>
    );

}

export function useUserAuth(){
    const { user } = useContext(UserAuthContext);
    return { user }
}

