import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, Timestamp,doc } from "firebase/firestore"
import { auth,database } from "../firebase-config"
import { Alert } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import AuthLayout from "../components/AuthLayout";
import { signInWithGoogle } from "../utils/googleAuth";

const Register = () =>{

    const[userData,setUserData] = useState({
        username:"",
        email:"",
        password:"",
        error:null
    });
    const [submitting,setSubmitting] = useState(false);
    const [showPassword,setShowPassword] = useState(false);
    const navigate = useNavigate()

    const { username,email,password,error } = userData;

    const register = async (e) =>{
       e.preventDefault();
       if(submitting) return
       if(!username || !email || !password ){
            setUserData({...userData,error:"Please fill all the required fields"})
            return
       }
       setSubmitting(true)
       try{
           const result = await createUserWithEmailAndPassword(auth,email,password);
           const docRef = doc(database,"users",result.user.uid);
           const payload = {
               username,
               email,
               createdAt: Timestamp.fromDate(new Date()),
               isOnline:true
           }
           // don't hold the redirect on this write — the account already exists
           setDoc(docRef,payload).catch((err)=>console.error("profile write failed:",err))
           navigate("/");

       }catch(err){
           setUserData({...userData,error:err.message})
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
            setUserData({...userData,error:err.message})
            setSubmitting(false)
        }
    }


    return(
        <AuthLayout title="Create Account" subtitle="Create an account to build your watchlist and pick up on any device.">
            { error ? <Alert variant="danger">{error}</Alert> :null }

            <button type="button" className="auth-google" onClick={handleGoogle} disabled={submitting}>
                <FaGoogle className="auth-google-icon"/> Continue with Google
            </button>

            <div className="auth-divider"><span>or</span></div>

            <form onSubmit={register}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        name="username"
                        className="form-control"
                        placeholder="Your username"
                        autoComplete="username"
                        onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Your Account</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email"
                        autoComplete="email"
                        onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
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
                            autoComplete="new-password"
                            onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
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
                </div>

                <div className="button">
                    <button className="btn" type="submit" disabled={submitting}>{submitting ? "Creating account..." : "Register"}</button>
                </div>
                <div className="form-link">
                    <p>Already have an account?<NavLink className="form-reg-link" to="/login">Sign in</NavLink></p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default Register;
