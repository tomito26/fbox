import { Navigate } from "react-router-dom"
import { useUserAuth } from "../Context/UserAuthContext"

const PrivateLink = ({ children }) =>{
    const{ user } = useUserAuth()
    if(!user){
        return <Navigate replace to="/login"/>;
    } 
    return children;
}

export default PrivateLink;