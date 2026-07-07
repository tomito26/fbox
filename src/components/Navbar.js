import { useEffect, useRef, useState } from 'react';
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
import Avatar from './Avatar';

// Pages whose first section is a full-bleed hero: the bar overlays the artwork
// (transparent at rest) and turns solid once the user scrolls past it.
const HERO_PATHS = new Set(['/', '/trendings', '/tvshows']);

// Small Movies/TV switch shown inside the Genres/Country dropdowns so a browse
// link targets the right media type instead of silently defaulting to movies.
const MediaToggle = ({ value, onChange }) => (
    <div className='nav-media-toggle' role='group' aria-label='Media type'>
        <button
            type='button'
            className={value === 'movie' ? 'active' : ''}
            aria-pressed={value === 'movie'}
            onClick={() => onChange('movie')}
        >Movies</button>
        <button
            type='button'
            className={value === 'tv' ? 'active' : ''}
            aria-pressed={value === 'tv'}
            onClick={() => onChange('tv')}
        >TV</button>
    </div>
);

const Navbar = () =>{
    const[isActive,setIsActive] = useState(false);
    const[userData,setUserData] = useState({});
    const[openNav,setOpenNav] = useState(null); // 'genres' | 'country' | null
    const[menuOpen,setMenuOpen] = useState(false);
    const[scrolled,setScrolled] = useState(false);
    const[genreMedia,setGenreMedia] = useState('movie'); // 'movie' | 'tv'
    const[countryMedia,setCountryMedia] = useState('movie');
    const { user} = useUserAuth();
    const navigate = useNavigate()
    const { pathname } = useLocation()

    const isHero = HERO_PATHS.has(pathname);

    // Refs so Escape can hand focus back to the control that opened a layer
    // (WCAG 2.4.3 / keyboard parity with the search combobox).
    const navToggleRef = useRef(null);
    const genresToggleRef = useRef(null);
    const countryToggleRef = useRef(null);
    const userToggleRef = useRef(null);

    const toggleNav = (name) => setOpenNav((cur) => (cur === name ? null : name));

    // TV genre ids differ from movie ids; keep only genres with a clean TV
    // mapping when the toggle is on TV so we never send a movie-only id to the
    // TV discover endpoint (which would return an empty grid).
    const genreList = genreMedia === 'tv'
        ? NAV_GENRES.filter((g) => g.tvId).map((g) => ({ ...g, id: g.tvId }))
        : NAV_GENRES;

    // Prefer the stored username, but fall back so the pill/avatar never render
    // blank for accounts without a Firestore username set.
    const displayName =
        userData.username ||
        auth.currentUser?.displayName ||
        (auth.currentUser?.email || user?.email || '').split('@')[0];

    // Close the mobile menu / dropdowns whenever the route changes
    useEffect(()=>{
        setMenuOpen(false);
        setOpenNav(null);
        setIsActive(false);
    },[pathname])

    // Toggle the solid/scrolled state on hero pages. Non-hero pages use the solid
    // bar unconditionally, so there's nothing to watch there.
    useEffect(()=>{
        if(!isHero){ setScrolled(false); return; }
        const onScroll = () => setScrolled(window.scrollY > 40);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    },[isHero])

    // Lock body scroll while the mobile menu overlay is open.
    useEffect(()=>{
        if(!menuOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    },[menuOpen])

    useEffect(()=>{
        const closeOnOutside = (e) => {
            if(!e.target.closest('.nav-dropdown')) setOpenNav(null);
            if(!e.target.closest('.user-dropdown')) setIsActive(false);
        };
        document.addEventListener('mousedown', closeOnOutside);
        return () => document.removeEventListener('mousedown', closeOnOutside);
    },[])

    // Escape closes the topmost open layer and returns focus to its trigger.
    useEffect(()=>{
        const onKeyDown = (e) => {
            if(e.key !== 'Escape') return;
            if(openNav === 'genres'){ setOpenNav(null); genresToggleRef.current?.focus(); }
            else if(openNav === 'country'){ setOpenNav(null); countryToggleRef.current?.focus(); }
            else if(isActive){ setIsActive(false); userToggleRef.current?.focus(); }
            else if(menuOpen){ setMenuOpen(false); navToggleRef.current?.focus(); }
        };
        document.addEventListener('keydown', onKeyDown);
        return () => document.removeEventListener('keydown', onKeyDown);
    },[openNav,isActive,menuOpen])

    useEffect(()=>{
        if(user){
            // snap.data() is undefined until the register-page profile write lands
            const unsub = onSnapshot(
                doc(database,"users",auth.currentUser?.uid),
                snap=>setUserData(snap.data() || {}),
                (err)=>console.error("user profile listener:",err)
            )
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

    const navClass = [
        'site-nav',
        isHero ? 'site-nav--hero' : '',
        isHero && scrolled ? 'site-nav--scrolled' : '',
    ].filter(Boolean).join(' ');

    return(
        <nav className={navClass}>
            <Link to="/" className="logo" aria-label="fbox.to home">
                <div className='image'>
                    <img src={Img} alt="fbox logo" />
                </div>
                <h3 className='text'>fbox.to</h3>
            </Link>
            <button
                type='button'
                className='nav-toggle'
                aria-label='Toggle navigation menu'
                aria-expanded={menuOpen}
                onClick={()=>setMenuOpen(o=>!o)}
                ref={navToggleRef}
            >
                {menuOpen ? <FaTimes/> : <FaBars/>}
            </button>
            <div className={`nav-collapse${menuOpen ? ' open' : ''}`}>
            <ul>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300 " :"#ccc" } }}  className="site-nav-link" to="/">Home</NavLink></li>
                <li className='nav-dropdown'>
                    <button
                        type='button'
                        className='site-nav-link nav-dropdown-toggle'
                        aria-haspopup='true'
                        aria-expanded={openNav === 'genres'}
                        onClick={()=>toggleNav('genres')}
                        ref={genresToggleRef}
                    >
                        Genres <FaCaretDown className='nav-caret'/>
                    </button>
                    { openNav === 'genres' &&
                        <div className='nav-dropdown-menu'>
                            <MediaToggle value={genreMedia} onChange={setGenreMedia} />
                            <div className='nav-dropdown-grid'>
                                {genreList.map(g=>
                                    <Link
                                        key={g.id}
                                        to={`/browse?media=${genreMedia}&genre=${g.id}&title=${encodeURIComponent(g.label)}`}
                                        onClick={()=>{setOpenNav(null);setMenuOpen(false);}}
                                    >{g.label}</Link>
                                )}
                            </div>
                        </div>
                    }
                </li>
                <li className='nav-dropdown'>
                    <button
                        type='button'
                        className='site-nav-link nav-dropdown-toggle'
                        aria-haspopup='true'
                        aria-expanded={openNav === 'country'}
                        onClick={()=>toggleNav('country')}
                        ref={countryToggleRef}
                    >
                        Country <FaCaretDown className='nav-caret'/>
                    </button>
                    { openNav === 'country' &&
                        <div className='nav-dropdown-menu'>
                            <MediaToggle value={countryMedia} onChange={setCountryMedia} />
                            <div className='nav-dropdown-grid'>
                                {NAV_COUNTRIES.map(c=>
                                    <Link
                                        key={c.code}
                                        to={`/browse?media=${countryMedia}&country=${c.code}&title=${encodeURIComponent(c.label)}`}
                                        onClick={()=>{setOpenNav(null);setMenuOpen(false);}}
                                    >{c.label}</Link>
                                )}
                            </div>
                        </div>
                    }
                </li>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300" :"#ccc" } }} className="site-nav-link" to="/movies">Movies</NavLink></li>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300" :"#ccc" } }} className="site-nav-link" to="/tvSeries">TV-Series</NavLink></li>
                <li><NavLink onClick={()=>setMenuOpen(false)} style={({isActive})=>{ return {color: isActive ?  "#FFC300 " :"#ccc" } }} className="site-nav-link" to="/topImdb">Top IMDb</NavLink></li>
            </ul>
            <SearchBox/>
            <div className="register">
                { !user ?
                    <NavLink onClick={()=>setMenuOpen(false)} to='/login'>
                        <ProfileIcon/>
                        Login/Register
                    </NavLink>
                    :
                    <div className='user-dropdown'>
                        <button
                            type='button'
                            className='dropdown-button'
                            onClick={()=>setIsActive(!isActive)}
                            aria-haspopup='true'
                            aria-expanded={isActive}
                            ref={userToggleRef}
                        >
                            <Avatar name={displayName} src={userData.photoURL} size={28} />
                            <p>{displayName}</p>
                            <FaCaretDown className='dropdown-caret'/>
                        </button>
                        { isActive &&
                            <div className='user-dropdown-panel'>
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
