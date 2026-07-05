import { useEffect,useState } from 'react';
import Img from '../logo.png';
import SearchBox from './SearchBox';
import ProfileIcon from './ProfileIcon';
import { useUserAuth } from '../Context/UserAuthContext';
import { FaBars, FaTimes, FaCaretDown, FaHeart, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import { auth, database } from '../firebase-config';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';
import { NAV_GENRES, NAV_COUNTRIES } from './categorySection/filterOptions';

const Navbar = () =>{
    const[isActive,setIsActive] = useState(false);
    const[userData,setUserData] = useState({});
    const[openNav,setOpenNav] = useState(null); // 'genres' | 'country' | null
    const[menuOpen,setMenuOpen] = useState(false);
    const { user} = useUserAuth();
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const toggleNav = (name) => setOpenNav((cur) => (cur === name ? null : name));

    // Close the mobile menu whenever the route changes
    useEffect(()=>{
        setMenuOpen(false);
        setOpenNav(null);
    },[pathname])

    useEffect(()=>{
        const closeOnOutside = (e) => {
            if(!e.target.closest('.nav-dropdown')) setOpenNav(null);
        };
        document.addEventListener('mousedown', closeOnOutside);
        return () => document.removeEventListener('mousedown', closeOnOutside);
    },[])

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
        <nav className={pathname === "/" || pathname === "/trendings" ||  pathname === "/tvshows" ? "navbar" : "nav"}>
            <div className="logo">
                <div className='image'>
                    <img src={Img} alt="fbox logo" />
                </div>
                <h3 className='text'>fbox.to</h3>
            </div>
            <button
                type='button'
                className='nav-toggle'
                aria-label='Toggle navigation menu'
                aria-expanded={menuOpen}
                onClick={()=>setMenuOpen(o=>!o)}
            >
                {menuOpen ? <FaTimes/> : <FaBars/>}
            </button>
            <div className={`nav-collapse${menuOpen ? ' open' : ''}`}>
            <ul>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300 " :"#ccc" } }}  className="nav-link" to="/">Home</NavLink></li>
                <li className='nav-dropdown'>
                    <button
                        type='button'
                        className='nav-link nav-dropdown-toggle'
                        aria-haspopup='true'
                        aria-expanded={openNav === 'genres'}
                        onClick={()=>toggleNav('genres')}
                    >
                        Genres <FaCaretDown className='nav-caret'/>
                    </button>
                    { openNav === 'genres' &&
                        <div className='nav-dropdown-menu'>
                            {NAV_GENRES.map(g=>
                                <Link
                                    key={g.id}
                                    to={`/browse?media=movie&genre=${g.id}&title=${encodeURIComponent(g.label)}`}
                                    onClick={()=>{setOpenNav(null);setMenuOpen(false);}}
                                >{g.label}</Link>
                            )}
                        </div>
                    }
                </li>
                <li className='nav-dropdown'>
                    <button
                        type='button'
                        className='nav-link nav-dropdown-toggle'
                        aria-haspopup='true'
                        aria-expanded={openNav === 'country'}
                        onClick={()=>toggleNav('country')}
                    >
                        Country <FaCaretDown className='nav-caret'/>
                    </button>
                    { openNav === 'country' &&
                        <div className='nav-dropdown-menu'>
                            {NAV_COUNTRIES.map(c=>
                                <Link
                                    key={c.code}
                                    to={`/browse?media=movie&country=${c.code}&title=${encodeURIComponent(c.label)}`}
                                    onClick={()=>{setOpenNav(null);setMenuOpen(false);}}
                                >{c.label}</Link>
                            )}
                        </div>
                    }
                </li>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300" :"#ccc" } }} className="nav-link" to="/movies">Movies</NavLink></li>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300" :"#ccc" } }} className="nav-link" to="/tvSeries">TV-Series</NavLink></li>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300 " :"#ccc" } }} className="nav-link" to="/topImdb">Top IMDb</NavLink></li>
            </ul>
            <SearchBox/>
            <div className="register">
                { !user ?
                    <NavLink onClick={()=>setMenuOpen(false)} to='/login'>
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
            </div>
        </nav>

    );
}
export default Navbar