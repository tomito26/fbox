import { createContext, useState } from "react";

const UserAuthContext = createContext({});

export  const UserAuthContextProvider = ({ children }) =>{
    const [user,setUser] = useState("");
    
    return(
        <UserAuthContext.Provider value={{}}>
            { children }
        </UserAuthContext.Provider>
    );

}

