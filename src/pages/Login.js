import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { auth, database } from "../firebase-config";
import AuthLayout from "../components/AuthLayout";
import { signInWithGoogle } from "../utils/googleAuth";

const Login = () =>{
    const[loginData,setLoginData] = useState({
        email:"",
        password:"",
        error:null
    });
    const [submitting,setSubmitting] = useState(false);
    const [showPassword,setShowPassword] = useState(false);
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

    const handleGoogle = async () =>{
        if(submitting) return
        setSubmitting(true)
        try{
            await signInWithGoogle();
            navigate("/");
        }catch(err){
            setLoginData({...loginData,error:err.message})
            setSubmitting(false)
        }
    }

    return(
        <AuthLayout title="Sign In" subtitle="Welcome back — pick up where you left off.">
            {error ? <Alert variant="danger">{loginData.error}</Alert> : null}

            <button type="button" className="auth-google" onClick={handleGoogle} disabled={submitting}>
                <FaGoogle className="auth-google-icon"/> Continue with Google
            </button>

            <div className="auth-divider"><span>or</span></div>

            <form onSubmit={handleLogin}>
                <div className="form-group">
                    <label htmlFor="email">Your Account</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email"
                        autoComplete="email"
                        onChange={(e)=>setLoginData({...loginData,[e.target.name]:e.target.value})}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <div className="auth-password">
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            name="password"
                            className="form-control"
                            placeholder="Password"
                            autoComplete="current-password"
                            onChange={e=>setLoginData({...loginData,[e.target.name]:e.target.value})}
                        />
                        <button
                            type="button"
                            className="auth-password-toggle"
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            onClick={()=>setShowPassword(v=>!v)}
                        >
                            {showPassword ? <FaEyeSlash/> : <FaEye/>}
                        </button>
                    </div>
                    <span className="forgot">
                        <NavLink className="link-button" to="/forgot-password">forgot your password?</NavLink>
                    </span>
                </div>
                <div className="button">
                    <button className="btn" type="submit" disabled={submitting}>{submitting ? "Signing in..." : "Login"}</button>
                </div>
                <div className="form-link">
                    <p>Don't have an Account?<NavLink className="form-reg-link" to="/register">Register</NavLink></p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Login;
