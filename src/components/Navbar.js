import { useEffect,useState } from 'react';
import Img from '../logo.png';
import SearchIcon from './SearchIcon';
import ProfileIcon from './ProfileIcon';
import { useUserAuth } from '../Context/UserAuthContext';
import { FaCaretDown, FaHeart, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { auth, database } from '../firebase-config';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { async } from '@firebase/util';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import Loading from './Loading';

const Navbar = () =>{
    const[isActive,setIsActive] = useState(false);
    const[userData,setUserData] = useState({});
    const[loading,setLoading] = useState(true);
    const { user} = useUserAuth();
    const navigate = useNavigate()

    useEffect(()=>{
        if(user){
            const unsub = onSnapshot(doc(database,"users",auth.currentUser?.uid),snap=>setUserData(snap.data()))
            return () => unsub
        }
    },[])

    const handleLogOut = async () =>{
        const docRef = doc(database,"users",auth.currentUser.uid)
        const payload = {
            isOnline:false
        }
        await updateDoc(docRef,payload)
        await signOut(auth)
        navigate("/login")
        

    }
  
   
    
    return(
        <nav className={window.location.pathname === "/" ? "navbar" : "nav"}>
            <div className="logo">
                <div className='image'>
                    <img src={Img} alt="fbox logo" />
                </div>
                <h3 className='text'>fbox.to</h3>
            </div>
            <ul>
                <li><NavLink style={({isActive})=>{ return {color: isActive ?  "#FFC300 " :"#ccc" } }}  className="nav-link" to="/">Home</NavLink></li>
                <li><span className='nav-link'>Genres</span></li>
                <li><span className='nav-link'>Country</span></li>
                <li><NavLink style={({isActive})=>{ return {color: isActive ?  "#FFC300" :"#ccc" } }} className="nav-link" to="/movies">Movies</NavLink></li>
                <li><NavLink style={({isActive})=>{ return {color: isActive ?  "#FFC300" :"#ccc" } }} className="nav-link" to="/tvSeries">TV-Series</NavLink></li>
                <li><NavLink style={({isActive})=>{ return {color: isActive ?  "#FFC300 " :"#ccc" } }} className="nav-link" to="/topImdb">Top IMDb</NavLink></li>
            </ul>
            <div className="search-form">
                <input type="text" name="searchItem" className='form-control' placeholder='Enter your keywords...'/>
                <SearchIcon/>
            </div>
            <div className="register">
                { !user ?
                    <NavLink  to='/login'>
                        <ProfileIcon/>
                        Login/Register
                    </NavLink>
                    :
                    <div className='dropdown-menu'>
                        <div className='dropdown-button' onClick={e=>setIsActive(!isActive)}>
                            <p>{userData.username}</p>
                            <button className='dropdown-btn'><FaCaretDown/></button>
                        </div>
                        { isActive &&
                            <div className='menu'>
                                <div className='user-menu'>
                                    <NavLink className='menu-link' to="/profile"><FaUserCircle className='icon'/>Profile</NavLink>
                                    <a href='#' className='menu-link'><FaHeart className='icon'/>My WatchList</a>
                                </div>
                                <button className='signOut-btn' onClick={handleLogOut}><FaSignOutAlt className='icon'/>SignOut</button>
                            </div>
                        
                        }
                    </div>
                   
                    
                }
            </div>
            
        </nav>

    );
}
export default Navbar