import { NavLink } from "react-router-dom";

const Login = () =>{
    return(
        <section className="sectionForm">
            <div className="formInput">
                <h2>Sign In</h2>
                <form>
                    <div className="form-group">
                        <label htmlFor="email">Your Account</label>
                        <input type="email" name="email" className="form-control" placeholder="Your Email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Password"/>
                        <span className="forgot"><a href="#">forgot your password?</a></span>
                    </div>
                    <div className="button">
                        <button className="btn">Login</button>
                    </div>
                    <div className="form-link">
                        <p>Don't have an Account?<NavLink to="/register">Register</NavLink></p>
                    </div>
                </form>
            </div>
        </section>
    );
};

export default Login