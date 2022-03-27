import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth,database } from "../firebase-config";
import { onSnapshot,doc } from 'firebase/firestore';


const UserAuthContext = createContext({});

export  const UserAuthContextProvider = ({ children }) =>{
    const [user,setUser] = useState("");
 

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(currentUser)=> setUser(currentUser));
        return () => unsub();
    },[])

    console.log(user)
    return(
        <UserAuthContext.Provider value={{ user }}>
            { children }
        </UserAuthContext.Provider>
    );

}

export function useUserAuth(){
    const { user} = useContext(UserAuthContext);
    return { user }
}

