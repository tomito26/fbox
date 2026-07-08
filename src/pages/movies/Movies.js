import { useState,useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import MoviePage from "./MoviePage";
import MoviePage2 from "./MoviePage2";
import MoviePage4 from "./MoviePage4";
import MoviesPage3 from "./MoviesPage3";
import { tmdbFetch } from "../../api/tmdb";
import ErrorMessage from "../../components/ErrorMessage";


const Movies = () =>{
    const [movies,setMovies] = useState([]);
    const[moviesPage2,setMoviesPage2] = useState([]);
    const[moviesPage3,setMoviesPage3] = useState([]);
    const[moviesPage4,setMoviesPage4]=useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getTopratedMovies();
        getTopratedMovies2();
        getTopratedMovies3();
        getTopratedMovies4();

    },[])

    const getTopratedMovies = async () =>{
        try {
            const data = await tmdbFetch("/movie/now_playing", { language: "en-US", page: 1 });
            setMovies(data.results);
        } catch (err) {
            setError("Couldn't load movies. Please try again later.");
        }
    }
    const getTopratedMovies2 = async () => {
        try {
            const data = await tmdbFetch("/movie/now_playing", { language: "en-US", page: 2 });
            setMoviesPage2(data.results);
        } catch (err) {
            setError("Couldn't load movies. Please try again later.");
        }
    }
    const getTopratedMovies3 = async () =>{
        try {
            const data = await tmdbFetch("/movie/now_playing", { language: "en-US", page: 3 });
            setMoviesPage3(data.results);
        } catch (err) {
            setError("Couldn't load movies. Please try again later.");
        }
    }
    const getTopratedMovies4 = async () =>{
        try {
            const data = await tmdbFetch("/movie/now_playing", { language: "en-US", page: 4 });
            setMoviesPage4(data.results);
        } catch (err) {
            setError("Couldn't load movies. Please try again later.");
        }
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
            {error && <ErrorMessage message={error}/>}
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