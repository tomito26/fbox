import Img from '../logo.png'
import SearchIcon from './SearchIcon';
const Navbar = () =>{
    return(
        <nav>
            <div className="logo">
                <img src={Img} alt="fbox logo" />
                <h3>Fbox.to</h3>
            </div>
            <ul>
                <li>Home</li>
                <li>Genre</li>
                <li>Country</li>
                <li>Movies</li>
                <li>TV-Series</li>
                <li>Top IMDb</li>
            </ul>
            <div className="search-form">
                <input type="text" name="searchItem" className='form-control' placeholder='Enter your keywords...'/>
                <SearchIcon/>
            </div>
        </nav>

    );
}
export default Navbar