import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, Timestamp,doc } from "firebase/firestore"
import { auth,database } from "../firebase-config"
const Register = () =>{

    const[userData,setUserData] = useState({
        username:"",
        email:"",
        password:"",
        error:null
    });
    const navigate = useNavigate()

    const { username,email,password,error } = userData;

    const register = async (e) =>{
       e.preventDefault();
       if(!username || !email || !password ){
            setUserData({...userData,error:"Please fill all the required fields"})
            return
       }
       try{
           const result = await createUserWithEmailAndPassword(auth,email,password);
           const docRef = doc(database,"users",result.user.uid);
           const payload = {
               username,
               email,
               createdAt: Timestamp.fromDate(new Date()),
               isOnline:true
           }
           await setDoc(docRef,payload)
           setUserData({
                username:"",
                email:"",
                password:"",
                error:null
           });
           navigate("/");

       }catch(err){
           setUserData({...userData,error:err.message})

       }

    }
    

    return(
        <section className="sectionForm">
            <div className="formInput">
                <h2>Create Account</h2>
                <p className="features">Create an account to enjoy features</p>
                { error ? 
                    <div className="alert">
                        <p>{error}</p>
                    </div>
                 :null
                }
                <form onSubmit={register}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input 
                            type="text" 
                            name="username" 
                            className="form-control" 
                            placeholder="Your username"
                            onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Your Account</label>
                        <input 
                            type="email" 
                            name="email" 
                            className="form-control" 
                            placeholder="Your Email"
                            onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            className="form-control" 
                            placeholder="Password"
                            onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
                        />
                    </div>

                    <div className="button">
                        <button className="btn" onClick={register}>Register</button>
                    </div>
                    <div className="form-link">
                        <p>Already have an account?<NavLink to="/login">Sign in</NavLink></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Register;