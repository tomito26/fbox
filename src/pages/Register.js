import { NavLink } from "react-router-dom";
const Register = () =>{
    return(
        <section className="sectionForm">
            <div className="formInput">
                <h2>Create Account</h2>
                <p className="features">Create an account to enjoy features</p>
                <form>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name="username" className="form-control" placeholder="Your username"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Your Account</label>
                        <input type="email" name="email" className="form-control" placeholder="Your Email"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" className="form-control" placeholder="Password"/>
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm">Password Confirmation</label>
                        <input type="password" name="confirm" className="form-control" placeholder="Repeat your Password" />
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