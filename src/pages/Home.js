import { FaChartLine, FaHamburger, FaListUl, FaPlayCircle } from "react-icons/fa";
import CarouselsContainer from "../components/CarouselsContainer";
import About from "./About";
import { NavLink, Outlet } from 'react-router-dom';


const Home = () =>{
    return(
        <div>
            <CarouselsContainer/>
            <About/>
            <div className="recommend-movies">
                <div className="recommend-menu">
                    <h3><span>Recommend</span></h3>
                    <ul>
                        <li><NavLink className="recommend-navLink" to="/"><FaPlayCircle className="movie-icon"/> Movies</NavLink></li>
                        <li><NavLink className="recommend-navLink" to="tvshows"><FaListUl className="movie-icon"/>TV Shows</NavLink></li>
                        <li><NavLink className="recommend-navLink" to="trendings"><FaChartLine className="movie-icon"/>Trending</NavLink></li>
                    </ul>
                </div>
                <Outlet/>
        
            </div>
        </div>
    );
};

export default Home;