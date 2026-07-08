import { useEffect, useState } from "react"
import MovieShow from "./MovieShow";
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const RequestedMovieShows = () =>{
    const[requestedMovieShows,setRequestedMovieShow] = useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getRequestedMovieShow();
    },[]);

    const getRequestedMovieShow = async () =>{
        try {
            const data = await tmdbFetch("/trending/all/week", { language: "en-US", page: 30 });
            setRequestedMovieShow(data.results)
        } catch (err) {
            setError("Couldn't load requested titles. Please try again later.");
        }
    }

    if (error) return <ErrorMessage message={error}/>;

    return(
        <div className="movie-wrapper">
            {requestedMovieShows.map(movieShow=> <MovieShow key={movieShow.id} movieShow={movieShow}/>)}
        </div>
    )
}

export default RequestedMovieShows;