import { useState,useEffect } from "react";
import { FaCalendarAlt, FaCaretDown, FaCaretUp, FaClone, FaCube, FaFilter, FaFolder, FaFolderOpen, FaGlobe, FaGlobeAmericas } from "react-icons/fa";
import MoviePage from "./MoviePage";
import MoviePage2 from "./MoviePage2";
import MoviePage4 from "./MoviePage4";
import MoviesPage3 from "./MoviesPage3";


const Movies = () =>{
    const [movies,setMovies] = useState([]);
    const[moviesPage2,setMoviesPage2] = useState([]);
    const[moviesPage3,setMoviesPage3] = useState([]);
    const[moviesPage4,setMoviesPage4]=useState([]);
    const [categoryIsActive,setCategoryIsActive] = useState(false);
    const[typeIsActive,setTypeIsActive] = useState(false);
    const[countryIsActive,setCountryIsActive] = useState(false);
    const[yearMenuIsActive,setYearMenuIsActive] = useState(false);
    const[qualityMenuIsActive,setQualityMenuIsActive] = useState(false);
    const[sortMenuIsActive,setSortMenuIsActive] = useState(false);
    useEffect(()=>{
        getTopratedMovies(); 
        getTopratedMovies2();
        getTopratedMovies3();    
        getTopratedMovies4();  

    },[])

    const getTopratedMovies = async () =>{
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setMovies(data.results);
    }
    const getTopratedMovies2 = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=2`);
        const data = await res.json();
        setMoviesPage2(data.results);
    }
    const getTopratedMovies3 = async () =>{
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=3`);
        const data = await res.json();
        setMoviesPage3(data.results);
    }
    const getTopratedMovies4 = async () =>{
        const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=4`);
        const data = await res.json();
        setMoviesPage4(data.results);
    }
  
    
  
    

    const categoryToggleBtn = () => {
        setTypeIsActive(false);
        setCountryIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false)
        setSortMenuIsActive(false)
        return categoryIsActive ? setCategoryIsActive(false) : setCategoryIsActive(true);
    }
    const typeDropdownMenuBtn = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false)
        setSortMenuIsActive(false)
        return typeIsActive ? setTypeIsActive(false) : setTypeIsActive(true);
    }
    const countriesDropdownMenu = () =>{
        setCategoryIsActive(false);
        setTypeIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false);
        setSortMenuIsActive(false)
        return countryIsActive ? setCountryIsActive(false) : setCountryIsActive(true);
    }
    const yearDropdownMenu = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setTypeIsActive(false);
        setQualityMenuIsActive(false)
        setSortMenuIsActive(false)
        return yearMenuIsActive ? setYearMenuIsActive(false) : setYearMenuIsActive(true);
    }
    const qualityDropdownMenu = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setTypeIsActive(false);
        setYearMenuIsActive(false);
        setSortMenuIsActive(false)
        return qualityMenuIsActive ? setQualityMenuIsActive(false) : setQualityMenuIsActive(true);
    }

    const sortDropdownMenu = () =>{
        setCategoryIsActive(false);
        setCountryIsActive(false);
        setTypeIsActive(false);
        setYearMenuIsActive(false);
        setQualityMenuIsActive(false);
        return sortMenuIsActive ? setSortMenuIsActive(false) :setSortMenuIsActive(true);  
    }
    
    
    return(
        <div className="movie-page">
            <div className="movie-header">
                <h2>
                    <span>Movies</span>
                    <hr />
                </h2>

                <div className="category-section">
                    <div className="dropdown-category">
                        <div className="category-dropdownBtn" onClick={categoryToggleBtn}>
                            <FaFolderOpen style={{marginRight:"5px",marginBottom:"2px"}}/>
                            Genre All
                        </div>
                        {categoryIsActive &&
                            <div className="menu-items">
                                <div className="div">
                                    <div className="form-check">
                                        <input type="checkbox" name="action" id="action" />
                                        <label htmlFor="action">Action</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="costume" id="costume" />
                                        <label htmlFor="costume">Costume</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="drama" id="drama" />
                                        <label htmlFor="drama">Drama</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="history" id="history" />
                                        <label htmlFor="history">History</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="mystery" id="mystery" />
                                        <label htmlFor="mystery">Mystery</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="sport" id="sport" />
                                        <label htmlFor="sport">Sport</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="western" id="western" />
                                        <label htmlFor="western">Western</label>
                                    </div>
                                </div>
                                <div className="div">
                                    <div className="form-check">
                                        <input type="checkbox" name="adventure" id="adventure" />
                                        <label htmlFor="adventure">Adventure</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="comedy" id="comedy" />
                                        <label htmlFor="comedy">Comedy</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="family" id="family" />
                                        <label htmlFor="family">Family</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="horror" id="horror" />
                                        <label htmlFor="horror">Horror</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="reality-tv" id="reality-tv" />
                                        <label htmlFor="reality-tv">Reality Tv</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="thriller" id="thriller" />
                                        <label htmlFor="thriller">Thriller</label>
                                    </div>
                                    <div className="form-check includeall">
                                        <input type="checkbox" name="includeall" id="includeall" />
                                        <label htmlFor="includeall">Include all selected</label>
                                    </div>
                                </div>
                                <div className="div">
                                    <div className="form-check">
                                        <input type="checkbox" name="animation" id="animation" />
                                        <label htmlFor="animation">Animation</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="crime" id="crime" />
                                        <label htmlFor="crime">
                                            Crime
                                        </label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="fantasy" id="fantasy" />
                                        <label htmlFor="fantasy">Fantasy</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="kungfu" id="kungfu" />
                                        <label htmlFor="kungfu">Kungfu</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="romance" id="romance" />
                                        <label htmlFor="romance">Romance</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="tvshows" id="tvshow" />
                                        <label htmlFor="tvshow">Tv Show</label>
                                    </div>
                                </div>
                                <div className="div">
                                    <div className="form-check">
                                        <input type="checkbox" name="biography" id="biography" />
                                        <label htmlFor="biography">Biography</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="documentary" id="documentary" />
                                        <label htmlFor="documentary">Documentary</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="gameshow" id="gameshow" />
                                        <label htmlFor="gameshow">Game-Show</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="music" id="music" />
                                        <label htmlFor="music">Music</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="sci-fi" id="sci-fi" />
                                        <label htmlFor="sci-fi">SCi-Fi</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="war" id="war" />
                                        <label htmlFor="war">war</label>
                                    </div>
                                </div>        
                            </div> 
                        }               
                    </div>
                    <div className="menu-type">
                        <div className="menu-type-btn" onClick={typeDropdownMenuBtn}>
                            <FaClone style={{marginRight:"5px",marginBottom:"2px"}} />
                            Type Movie
                        </div>
                        { typeIsActive &&
                            <div className="menu-type-items">
                                <div className="form-check">
                                    <input type="checkbox" name="movie" id="movie"/>
                                    <label htmlFor="movie">Movie</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" name="series" id="series"/>
                                    <label htmlFor="series">Series</label>
                                </div>

                            </div>
                        }
                    </div>
                    <div className="country-dropdown-menu">
                        <div className="country-btn" onClick={countriesDropdownMenu}>
                            <FaGlobeAmericas style={{marginRight:"5px",marginBottom:"2px"}}/>
                            Country All
                        </div>
                        { countryIsActive &&
                            <div className="countries-menu">
                                <div className="contries-wrapper1">
                                    <div className="form-check">
                                        <input type="checkbox" name="argentina" id="argentina" />
                                        <label htmlFor="argentina">Argentina</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="brazil" id="brazil" />
                                        <label htmlFor="brazil">Brazil</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="denmark" id="denmark" />
                                        <label htmlFor="denmark">Denmark</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="hongkong" id="hongkong" />
                                        <label htmlFor="hongkong">HongKong</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="ireland" id="ireland" />
                                        <label htmlFor="ireland">Ireland</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="mexico" id="mexico" />
                                        <label htmlFor="mexico">Mexico</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="philippines" id="philippines" />
                                        <label htmlFor="philippines">Philippines</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="southafrica" id="southafrica" />
                                        <label htmlFor="southafrica">South Africa</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="switzerland" id="switzerland" />
                                        <label htmlFor="switzerland">Switzerland</label>
                                    </div>
                                </div>
                                <div className="countries-wrapper2">
                                    <div className="form-check">
                                        <input type="checkbox" name="australia" id="australia" />
                                        <label htmlFor="australia">Australia</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="canada" id="canada" />
                                        <label htmlFor="canada">Canada</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="finland" id="finland" />
                                        <label htmlFor="finland">Finland</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="hungary" id="hungary" />
                                        <label htmlFor="hungary">Hungary</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="israel" id="israel" />
                                        <label htmlFor="israel">Israel</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="netherland" id="netherland" />
                                        <label htmlFor="netherland">Netherland</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="poland" id="poland" />
                                        <label htmlFor="poland">Poland</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="south korea" id="south-korea" />
                                        <label htmlFor="south-korea">South Korea</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="United Kingdom" id="united-kingdom" />
                                        <label htmlFor="united-kingdom">United Kingdom</label>
                                    </div>
                                </div>
                                <div className="countries-wrapper3">
                                    <div className="form-check">
                                        <input type="checkbox" name="austria" id="austria" />
                                        <label htmlFor="austria">Austria</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="china" id="china" />
                                        <label htmlFor="china">China</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="france" id="france" />
                                        <label htmlFor="france">France</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="India" id="india" />
                                        <label htmlFor="india">India</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="italy" id="italy" />
                                        <label htmlFor="italy">Italy</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="New zealand" id="new-zealand" />
                                        <label htmlFor="new-zealand">New Zealand</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Romania" id="romania" />
                                        <label htmlFor="romania">Romania</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Spain" id="spain" />
                                        <label htmlFor="spain">Spain</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="United States" id="united-states" />
                                        <label htmlFor="united-states">United States</label>
                                    </div>
                                </div>
                                <div className="countries-wrapper4">
                                    <div className="form-check">
                                        <input type="checkbox" name="Belgium" id="belgium" />
                                        <label htmlFor="belgium">Belgium</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Czech Republic" id="czech-republic" />
                                        <label htmlFor="czech-republic">Czech Republic</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Germany" id="germany" />
                                        <label htmlFor="germany">Germany</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="International" id="international" />
                                        <label htmlFor="international">International</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Japan" id="japan" />
                                        <label htmlFor="japan">Japan</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Norway" id="norway" />
                                        <label htmlFor="norway">Norway</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Russia" id="russia" />
                                        <label htmlFor="russia">Russia</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="Sweden" id="sweden" />
                                        <label htmlFor="sweden">Sweden</label>
                                    </div>
                                </div>
                            </div>
                        }                      
                    </div>
                    <div className="yearDropdownMenu">
                        <div className="yearDropdownBtn" onClick={yearDropdownMenu}>
                            <FaCalendarAlt style={{marginRight:"5px",marginBottom:"2px"}}/>
                            Year All
                        </div>
                        { yearMenuIsActive &&
                            <div className="yearDropdownItems">
                                <div className="yearItems-wrapper1">
                                    <div className="form-check">
                                        <input type="checkbox" name="2022" id="2022" />
                                        <label htmlFor="2022">2022</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2019" id="2019" />
                                        <label htmlFor="2019">2019</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2016" id="2016" />
                                        <label htmlFor="2016">2016</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2013" id="2013" />
                                        <label htmlFor="2013">2013</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2010" id="2010" />
                                        <label htmlFor="2010">2010</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2007" id="2007" />
                                        <label htmlFor="2007">2007</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2004" id="2004" />
                                        <label htmlFor="2004">2004</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2000s" id="2000s" />
                                        <label htmlFor="2000s">2000s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1970s" id="1970s" />
                                        <label htmlFor="1970s">1970s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1940s" id="1940s" />
                                        <label htmlFor="1940s">1940s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1910s" id="1910s" />
                                        <label htmlFor="1910s">1910s</label>
                                    </div>
                                </div>
                                <div className="yearDropdownItems-wrapper-2">
                                    <div className="form-check">
                                        <input type="checkbox" name="2021" id="2021" />
                                        <label htmlFor="2021">2021</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2018" id="2018" />
                                        <label htmlFor="2018">2018</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2015" id="2015" />
                                        <label htmlFor="2015">2015</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2012" id="2012" />
                                        <label htmlFor="2012">2012</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2009" id="2009" />
                                        <label htmlFor="2009">2009</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2006" id="2006" />
                                        <label htmlFor="2006">2006</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2003" id="2003" />
                                        <label htmlFor="2003">2003</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1990s" id="1990s" />
                                        <label htmlFor="1990s">1990s</label></div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1960s" id="1960s" />
                                        <label htmlFor="1960s">1960s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1930s" id="1930s" />
                                        <label htmlFor="1930s">1930s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1900s" id="1900s" />
                                        <label htmlFor="1900s">1900s</label>
                                    </div>
                                </div>
                                <div className="yearDropdownItems-wrapper3">
                                    <div className="form-check">
                                        <input type="checkbox" name="2020" id="2020" />
                                        <label htmlFor="2020">2020</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2017" id="2017" />
                                        <label htmlFor="2017">2017</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2014" id="2014" />
                                        <label htmlFor="2014">2014</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2011" id="2011" />
                                        <label htmlFor="2011">2011</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2008" id="2008" />
                                        <label htmlFor="2008">2008</label></div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2005" id="2005" />
                                        <label htmlFor="2005">2005</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="2002" id="2002" />
                                        <label htmlFor="2002">2002</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1980s" id="1980s" />
                                        <label htmlFor="1980s">1980s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1950s" id="1950s" />
                                        <label htmlFor="1950s">1950s</label>
                                    </div>
                                    <div className="form-check">
                                        <input type="checkbox" name="1920s" id="1920s" />
                                        <label htmlFor="1920s">1920s</label>
                                    </div>
                                </div>
                            </div>
                        }
                     
                    </div>
                    <div className="quality">
                        <div className="qualityBtn" onClick={qualityDropdownMenu}>
                            <FaCube style={{marginRight:"5px",marginBottom:"2px"}} />
                            Quality All
                        </div>
                        { qualityMenuIsActive &&
                            <div className="qualityMenu">
                                <div className="form-check">
                                    <input type="checkbox" name="HD" id="hd" />
                                    <label htmlFor="hd">HD</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" name="HDRip" id="hdrip" />
                                    <label htmlFor="hdrip">HRip</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" name="SD" id="sd" />
                                    <label htmlFor="sd">SD</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" name="TS" id="ts" />
                                    <label htmlFor="ts">TS</label>
                                </div>
                                <div className="form-check">
                                    <input type="checkbox" name="CAM" id="cam" />
                                    <label htmlFor="cam">CAM</label>
                                </div>
                            </div>
                        }
                    </div>
                    <div className="sortMenu">
                        <div className="sortBtn" onClick={sortDropdownMenu}>
                            <span style={{marginRight:"5px"}}>
                                <FaCaretUp style={{margin:"0",padding:"0"}}/>
                                <FaCaretDown style={{margin:"0",padding:"0"}}/>
                            </span>
                            <span>Sort Default</span>
                        </div>
                        { sortMenuIsActive &&
                            <div className="sort-items">
                                <div className="form-check">
                                    <input type="radio" name="sort" id="default" />
                                    <label htmlFor="default">Default</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" name="sort" id="recently-added" />
                                    <label htmlFor="recently-added">Recently Added</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" name="sort" id="most-watched" />
                                    <label htmlFor="most-watched">Most Watched</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" name="sort" id="name" />
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" name="sort" id="imdb" />
                                    <label htmlFor="imdb">IMDb</label></div>
                                <div className="form-check">
                                    <input type="radio" name="sort" id="release-date" />
                                    <label htmlFor="release-date">Release Date</label>
                                </div>
                                <div className="form-check">
                                    <input type="radio" name="sort" id="site-rating" />
                                    <label htmlFor="site-rating">Site Rating</label>
                                </div>
                            </div>
                        }
                    </div>
                    <button className="filterBtn"><FaFilter style={{marginRight:"5px"}}/>Filter</button>
                </div>
            </div>
            <div className="movie-wrapper">
                {
                    movies.map((movie=> <MoviePage movie={movie} key={movie.id}/>))
                }
                
            </div>
            <div className="movie-wrapper">
                {
                    moviesPage2 ? moviesPage2.map((movie=> <MoviePage2 movie={movie} key={movie.id}/>)): ""
                }
                
            </div>
            <div className="movie-wrapper">
                {
                    moviesPage3 ? moviesPage3.map((movie=> <MoviesPage3 movie={movie} key={movie.id}/>)): ""
                }
                
            </div>
            <div className="movie-wrapper">
                {
                    moviesPage4 ? moviesPage4.map((movie=> <MoviePage4 movie={movie} key={movie.id}/>)): ""
                }
                
            </div>
        </div>
    );
};

export default Movies;