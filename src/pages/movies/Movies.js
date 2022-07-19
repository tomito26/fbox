import { useState,useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import MoviePage from "./MoviePage";
import MoviePage2 from "./MoviePage2";
import MoviePage4 from "./MoviePage4";
import MoviesPage3 from "./MoviesPage3";


const Movies = () =>{
    const [movies,setMovies] = useState([]);
    const[moviesPage2,setMoviesPage2] = useState([]);
    const[moviesPage3,setMoviesPage3] = useState([]);
    const[moviesPage4,setMoviesPage4]=useState([]);

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
     
    
    return(
        <div className="movie-page">
            <div className="movie-header">
                <h2>
                    <span>Movies</span>
                    <hr />
                </h2>
                <DropdownMenus/>
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