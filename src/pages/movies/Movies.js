import { useState,useEffect } from "react";
import { FaCalendarAlt, FaCaretDown, FaCaretUp, FaClone, FaCube, FaFilter, FaFolder, FaFolderOpen, FaGlobe, FaGlobeAmericas } from "react-icons/fa";
import CategoryType from "../../components/categorySection/CategoryType";
import CountriesMenu from "../../components/categorySection/CountriesMenu";
import MovieGenre from "../../components/categorySection/MovieGenre";
import Quality from "../../components/categorySection/Quality";
import ReleaseYear from "../../components/categorySection/ReleaseYear";
import SortMenu from "../../components/categorySection/SortMenu";
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
        const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setMovies(data.results);
    }
    const getTopratedMovies2 = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=2`);
        const data = await res.json();
        setMoviesPage2(data.results);
    }
    const getTopratedMovies3 = async () =>{
        const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=3`);
        const data = await res.json();
        setMoviesPage3(data.results);
    }
    const getTopratedMovies4 = async () =>{
        const res = await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=4`);
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
                        {categoryIsActive && <MovieGenre/>}               
                    </div>
                    <div className="menu-type">
                        <div className="menu-type-btn" onClick={typeDropdownMenuBtn}>
                            <FaClone style={{marginRight:"5px",marginBottom:"2px"}} />
                            Type Movie
                        </div>
                        { typeIsActive && <CategoryType/> }
                    </div>
                    <div className="country-dropdown-menu">
                        <div className="country-btn" onClick={countriesDropdownMenu}>
                            <FaGlobeAmericas style={{marginRight:"5px",marginBottom:"2px"}}/>
                            Country All
                        </div>
                        { countryIsActive && <CountriesMenu/>  }                      
                    </div>
                    <div className="yearDropdownMenu">
                        <div className="yearDropdownBtn" onClick={yearDropdownMenu}>
                            <FaCalendarAlt style={{marginRight:"5px",marginBottom:"2px"}}/>
                            Year All
                        </div>
                        { yearMenuIsActive && <ReleaseYear/> }
                    </div>
                    <div className="quality">
                        <div className="qualityBtn" onClick={qualityDropdownMenu}>
                            <FaCube style={{marginRight:"5px",marginBottom:"2px"}} />
                            Quality All
                        </div>
                        { qualityMenuIsActive &&  <Quality/>}
                    </div>
                    <div className="sortMenu">
                        <div className="sortBtn" onClick={sortDropdownMenu}>
                            <span style={{marginRight:"5px"}}>
                                <FaCaretUp style={{margin:"0",padding:"0"}}/>
                                <FaCaretDown style={{margin:"0",padding:"0"}}/>
                            </span>
                            <span>Sort Default</span>
                        </div>
                        { sortMenuIsActive && <SortMenu/>   }
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