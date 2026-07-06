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
    const [submitting,setSubmitting] = useState(false);
    const navigate = useNavigate()

    const{email,password,error} = loginData;

    const handleLogin = async (e) =>{
        e.preventDefault();
        if(submitting) return
        if(!email || !password ){
            setLoginData({...loginData,error:"Please fill all the required fields"})
            return
        }
        setSubmitting(true)
        try{
            await signInWithEmailAndPassword(auth,email,password);
            const docRef = doc(database,"users",auth.currentUser.uid)
            const payload = {
                isOnline:true
            }
            // presence flag only — don't hold the redirect on it
            updateDoc(docRef,payload).catch((err)=>console.error("presence update failed:",err));
            navigate("/");
        }catch(err){
            setLoginData({...loginData,error:err.message})
            setSubmitting(false)
        }

    }
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
                        <span className="forgot"><button type="button" className="link-button">forgot your password?</button></span>
                    </div>
                    <div className="button">
                        <button className="btn" onClick={handleLogin} disabled={submitting}>{submitting ? "Signing in..." : "Login"}</button>
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