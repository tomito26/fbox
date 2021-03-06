import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase-config";

const Login = () =>{
    const[loginData,setLoginData] = useState({
        email:"",
        password:"",
        error:null
    });
    const navigate = useNavigate()

    const{email,password,error} = loginData;

    const handleLogin = async (e) =>{
        e.preventDefault();
        if(!email || !password ){
            setLoginData({...loginData,error:"Please fill all the required fields"})
            return
        }
        try{
            await signInWithEmailAndPassword(auth,email,password);
            const docRef = doc(database,"users",auth.currentUser.uid)
            const payload = {
                isOnline:true
            }
            await updateDoc(docRef,payload);
            navigate("/");
        }catch(err){
            setLoginData({...loginData,error:err.message})
        }

    }
    console.log(loginData)
    return(
        <section className="sectionForm">
            <div className="formInput">
                <h2>Sign In</h2>
                {error ? <Alert variant="danger">{loginData.error}</Alert> : null}
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="email">Your Account</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            placeholder="Your Email"
                            onChange={(e)=>setLoginData({...loginData,[e.target.name]:e.target.value})}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="Password"
                            onChange={e=>setLoginData({...loginData,[e.target.name]:e.target.value})}
                        />
                        <span className="forgot"><a href="#">forgot your password?</a></span>
                    </div>
                    <div className="button">
                        <button className="btn" onClick={handleLogin}>Login</button>
                    </div>
                    <div className="form-link">
                        <p>Don't have an Account?<NavLink className="form-reg-link" to="/register">Register</NavLink></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login;