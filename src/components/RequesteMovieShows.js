import { useEffect, useState } from "react"
import MovieCard from "./MovieCard";
import SeriesCard from "./SeriesCard";

const RequestedMovieShows = () =>{
    const[requestedMovieShows,setRequestedMovieShow] = useState([]);

    useEffect(()=>{
        getRequestedMovieShow();
    },[]);

    const getRequestedMovieShow = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=30`);
        const data = await rest.json(); 
        setRequestedMovieShow(data.results)
    }
    return(
        <div className="movie-wrapper">
            {requestedMovieShows
                .filter(item => item.media_type === "movie" || item.media_type === "tv")
                .map(item => item.media_type === "tv"
                    ? <SeriesCard key={item.id} tvShow={item}/>
                    : <MovieCard key={item.id} movie={item}/>)}
        </div>
    )
}

export default RequestedMovieShows;