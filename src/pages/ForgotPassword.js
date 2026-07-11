import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { auth } from "../firebase-config";
import AuthLayout from "../components/AuthLayout";

const ForgotPassword = () =>{
    const [email,setEmail] = useState("");
    const [error,setError] = useState(null);
    const [sent,setSent] = useState(false);
    const [submitting,setSubmitting] = useState(false);

    const handleReset = async (e) =>{
        e.preventDefault();
        if(submitting) return
        if(!email){
            setError("Please enter your email address")
            return
        }
        setSubmitting(true)
        setError(null)
        try{
            await sendPasswordResetEmail(auth,email);
            setSent(true)
        }catch(err){
            setError(err.message)
        }
        setSubmitting(false)
    }

    return(
        <AuthLayout title="Reset Password" subtitle="Enter your email and we'll send you a link to get back in.">
            {error ? <Alert variant="danger">{error}</Alert> : null}
            {sent ? (
                <Alert variant="success">
                    If an account exists for <strong>{email}</strong>, a reset link is on its way. Check your inbox.
                </Alert>
            ) : null}

            <form onSubmit={handleReset}>
                <div className="form-group">
                    <label htmlFor="email">Your Account</label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        className="form-control"
                        placeholder="Your Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e)=>setEmail(e.target.value)}
                    />
                </div>
                <div className="button">
                    <button className="btn" type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send reset link"}</button>
                </div>
                <div className="form-link">
                    <p>Remembered it?<NavLink className="form-reg-link" to="/login">Sign in</NavLink></p>
                </div>
            </form>
        </AuthLayout>
    );
};

export default ForgotPassword;
