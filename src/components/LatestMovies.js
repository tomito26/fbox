import { useEffect, useState } from "react";
import LatestMovie from "./LatestMovie";
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const LatestMovies =  () =>{
    const[latestMovies,setLatestMovies] = useState([]);
    const [error,setError] = useState(null);
    useEffect(()=>{
        getLatestMovies()
    },[])

    const getLatestMovies = async () =>{
        try {
            const data = await tmdbFetch("/movie/now_playing", { language: "en-US", page: 1 });
            setLatestMovies(data.results)
        } catch (err) {
            setError("Couldn't load latest movies. Please try again later.");
        }
    }

    if (error) return <ErrorMessage message={error}/>;

    return(
        <div className="movie-wrapper">
            {latestMovies.map(movie => <LatestMovie key={movie.id} movie={movie}/>)}
        </div>
    );
};
export default LatestMovies;