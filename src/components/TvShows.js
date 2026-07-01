import { useEffect, useState } from "react";
import TvShow from "./TvShow";
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const TvShows =  () =>{
    const[tvShows,setTvShows] = useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getTvShows()
    },[]);

    const getTvShows = async () =>{
        try {
            const data = await tmdbFetch("/tv/top_rated", { language: "en-US", page: 1 });
            setTvShows(data.results)
        } catch (err) {
            setError("Couldn't load TV shows. Please try again later.");
        }
    }

    if (error) return <ErrorMessage message={error}/>;

    return(
        <div className="movie-wrapper">
            {tvShows.map(tvShow => <TvShow key={tvShow.id} tvShow={tvShow}/>)}
        </div>
    );
};

export default TvShows