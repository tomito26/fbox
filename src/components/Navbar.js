import { useEffect,useState } from 'react';
import Img from '../logo.png';
import SearchIcon from './SearchIcon';
import ProfileIcon from './ProfileIcon';
import { useUserAuth } from '../Context/UserAuthContext';
import { FaCaretDown, FaHeart, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { auth, database } from '../firebase-config';
import { NavLink, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const Navbar = () =>{
    const[isActive,setIsActive] = useState(false);
    const[userData,setUserData] = useState({});
    const[searchTerm,setSearchTerm] = useState("");
    const { user} = useUserAuth();
    const navigate = useNavigate()

    const handleSearch = (e) =>{
        e.preventDefault();
        const query = searchTerm.trim();
        if(!query) return;
        navigate(`/search?q=${encodeURIComponent(query)}`);
        setSearchTerm("");
    }

    useEffect(()=>{
        if(user){
            const unsub = onSnapshot(doc(database,"users",auth.currentUser?.uid),snap=>setUserData(snap.data()))
            return () => unsub()
        }
    },[user])

    const handleLogOut = async () =>{
        const docRef = doc(database,"users",auth.currentUser.uid)
        const payload = {
            isOnline:false
        }
        await updateDoc(docRef,payload)
        await signOut(auth)
        setIsActive(false)
        navigate("/login")
        

    }
  
   
    
    return(
        <nav className={window.location.pathname === "/" || window.location.pathname === "/trendings" ||  window.location.pathname === "/tvshows" ? "navbar" : "nav"}>
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
            <form className="search-form" onSubmit={handleSearch} role="search">
                <input
                    type="text"
                    name="searchItem"
                    className='form-control'
                    placeholder='Enter your keywords...'
                    aria-label="Search movies and TV shows"
                    value={searchTerm}
                    onChange={e=>setSearchTerm(e.target.value)}
                />
                <button type="submit" className="search-btn" aria-label="Search">
                    <SearchIcon/>
                </button>
            </form>
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
                                    <NavLink className='menu-link' to="/profile" onClick={()=>setIsActive(false)}><FaUserCircle className='icon'/>Profile</NavLink>
                                    <NavLink className='menu-link' to="/watchlist" onClick={()=>setIsActive(false)}><FaHeart className='icon'/>My WatchList</NavLink>
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