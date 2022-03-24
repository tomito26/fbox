import { useEffect,useState } from 'react';
import Img from '../logo.png';
import SearchIcon from './SearchIcon';
import ProfileIcon from './ProfileIcon';
import { useUserAuth } from '../Context/UserAuthContext';
import { FaCaretDown, FaHeart, FaSignOutAlt, FaUserCircle } from 'react-icons/fa'
import {  } from "react-icons/hi";
import { doc, onSnapshot } from 'firebase/firestore';
import { database } from '../firebase-config';
import { NavLink } from 'react-router-dom';

const Navbar = () =>{
    const [profile,setProfile] = useState("")
    const { user} = useUserAuth();
    useEffect(()=>{
        if(!user.uid){
            console.log(user.uid)
        }else{
            const unsub = onSnapshot(doc(database,"users", user.uid),(snap)=>setProfile(snap.data()));
            return ()=>unsub
        }
    },[])   
   
    
    console.log(profile)
    return(
        <nav>
            <div className="logo">
                <div className='image'>
                    <img src={Img} alt="fbox logo" />
                </div>
                <h3 className='text'>Fbox.to</h3>
            </div>
            <ul>
                <li><NavLink className="nav-link" to="/home">Home</NavLink></li>
                <li><span className='nav-link'>Genres</span></li>
                <li><span className='nav-link'>Country</span></li>
                <li><NavLink className="nav-link" to="/movies">Movies</NavLink></li>
                <li><NavLink className="nav-link" to="/tvSeries">TV-Series</NavLink></li>
                <li><NavLink className="nav-link" to="/topImdb">Top IMDb</NavLink></li>
            </ul>
            <div className="search-form">
                <input type="text" name="searchItem" className='form-control' placeholder='Enter your keywords...'/>
                <SearchIcon/>
            </div>
            <div className="register">
                { !user ?
                    <a href='#'>
                        <ProfileIcon/>
                        Login/Register
                    </a>
                    :
                    <div className='dropdown-menu'>
                        <p>{user.email}</p><button className='dropdown-btn'><FaCaretDown/></button>
                        <div className='menu'>
                            <a><FaUserCircle className='icon'/>Profile</a>
                            <a><FaHeart className='icon'/>My WatchList</a>
                            <a><FaSignOutAlt className='icon'/>SignOut</a>
                        </div>
                    </div>
                   
                    
                }
            </div>
            
        </nav>

    );
}
export default Navbar