import { useState } from "react";
import { NavLink } from "react-router-dom";
const Register = () =>{

    const[userData,setUserData] = useState({
        username:"",
        email:"",
        password:"",
        confirmPassword:"",
        error:null
    });

    const { username,email,password,confirmPassword,error } = userData;

    const Register =  (e) =>{
        e.preventDefault();
        console.log(userData)

    }

    return(
        <section className="sectionForm">
            <div className="formInput">
                <h2>Create Account</h2>
                <p className="features">Create an account to enjoy features</p>
                <form onSubmit={Register}>
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

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Password Confirmation</label>
                        <input 
                            type="password" 
                            name="confirmPassword" 
                            className="form-control" 
                            placeholder="Repeat your Password" 
                            onChange={(e)=>setUserData({...userData,[e.target.name]:e.target.value})}
                        />
                    </div>
                    <div className="button">
                        <button className="btn">Registergi</button>
                    </div>
                    <div className="form-link">
                        <p>Already have an account?<NavLink to="/">Sign in</NavLink></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Register;