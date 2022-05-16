const Profile = () =>{
    return(
    <div className="profile-page">
        <h2>Edit Profile</h2>
        <div className="profile-form">
            <form>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input type="text" className="form-input" name="userName"/>
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="text" className="form-input" name="email"/>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="text" className="form-input" name="password"/>
                </div>
                <div className="form-group">
                    <label htmlFor="passwordConfirmation">Password Confirmation</label>
                    <input type="text" className="form-input" name="passwordConfirmation"/>
                </div>
                <div className="save-button">
                    <button className="saveBtn">Save Changes</button>
                </div>
            </form>
        </div>

    </div>);
};

export default Profile;

