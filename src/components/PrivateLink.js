import { Navigate } from "react-router-dom"
import { useUserAuth } from "../Context/UserAuthContext"

const PrivateLink = ({ children }) =>{
    const{ user } = useUserAuth()
    if(!user){
        return <Navigate to="/"/>;

    }
    return children;
}

export default PrivateLink;