import { useEffect, useState } from "react"
import MovieShow from "./MovieShow";

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
            {requestedMovieShows.map(movieShow=> <MovieShow key={movieShow.id} movieShow={movieShow}/>)}
        </div>
    )
}

export default RequestedMovieShows;