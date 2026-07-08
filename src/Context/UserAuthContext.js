import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase-config";
import Loading from "../components/Loading";


const UserAuthContext = createContext({});

export  const UserAuthContextProvider = ({ children }) =>{
    const [user,setUser] = useState(null);
    const [loading,setLoading] = useState(true)
 

    useEffect(()=>{
        const unsub = onAuthStateChanged(auth,(currentUser)=> {
            setUser(currentUser)
            setLoading(false);
        });
        return () => unsub();
    },[])

    if(loading){
        return <Loading/>
    }
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

