import { onSnapshot,doc } from 'firebase/firestore';
import { useState,useEffect } from 'react'
import { useUserAuth } from '../Context/UserAuthContext';
import { database,auth } from '../firebase-config';
const Profile = () =>{
  const[newProfile,setNewProfile] = useState({
        newUsername:"",
        newEmail:"",
        newPassword:"",
        confirmPassword:"",
  });

  const { user} = useUserAuth();
  const[userData,setUserData]= useState({});

  useEffect(()=>{
    if(user){
        const unsub = onSnapshot(doc(database,"users",auth.currentUser?.uid),snap=>setUserData(snap.data()))
        return () => unsub
    }
  },[])

  const { newUsername,newEmail,newPassword,confirmPassword } = newProfile;

  const handleProfileUpdate = (e) =>{
      e.preventDefault()
      console.log(newProfile)

  }

  console.log(userData)

    return(
    <div className="profile-page">
        <h2>
            <span>Edit Profile</span>
        </h2>
        <div className="profile-form">
            <form onSubmit={handleProfileUpdate}>
                <div className="form-group-profile">
                    <label htmlFor="username">Username</label>
                    <input 
                        type="text" 
                        className="form-input" 
                        name="newUsername" 
                        id="username"
                        placeholder={userData.username}
                        onChange={(e)=>setNewProfile({...newProfile, [e.target.name]:e.target.value})}
                    />
                </div>
                <div className="form-group-profile">
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email" 
                        className="form-input" 
                        name="newEmail"
                        placeholder={userData.email}
                        id="email"
                        onChange={(e)=>setNewProfile({...newProfile,[e.target.name]:e.target.value})}
                    />
                </div>
                <div className="form-group-profile">
                    <label htmlFor="password">Password</label>
                    <input 
                        type="password" 
                        className="form-input" 
                        name="newPassword" 
                        id="password" 
                        placeholder="New Password"
                        onChange={e=>setNewProfile({...newProfile,[e.target.name]:e.target.value})}
                    />
                </div>
                <div className="form-group-profile">
                    <label htmlFor="passwordConfirmation">Password Confirmation</label>
                    <input 
                        type="password" 
                        className="form-input" 
                        name="confirmPassword" 
                        placeholder="Repeat new Password"
                        onChange={e =>setNewProfile({...newProfile,[e.target.name]:e.target.value})}
                    />
                </div>
                <div className="save-button">
                    <button className="saveBtn" onClick={handleProfileUpdate}>Save Changes</button>
                </div>
            </form>
        </div>

    </div>);
};

export default Profile;

