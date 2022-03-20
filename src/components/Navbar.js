import Img from '../logo.png'
import SearchIcon from './SearchIcon';
import ProfileIcon from './ProfileIcon'
const Navbar = () =>{
    return(
        <nav>
            <div className="logo">
                <div className='image'>
                    <img src={Img} alt="fbox logo" />
                </div>
                <h3 className='text'>Fbox.to</h3>
            </div>
            <ul>
                <li><a href="#home">Home</a></li>
                <li><a href="#genres">Genres</a></li>
                <li><a href="#country">Country</a></li>
                <li><a href="#movies">Movies</a></li>
                <li><a href="tvSeries">TV-Series</a></li>
                <li><a href="topImdb">Top IMDb</a></li>
            </ul>
            <div className="search-form">
                <input type="text" name="searchItem" className='form-control' placeholder='Enter your keywords...'/>
                <SearchIcon/>
            </div>
            <div className="register">
                <a href='#'>
                    <ProfileIcon/>
                    Login/Register
                </a>
            </div>
            
        </nav>

    );
}
export default Navbar