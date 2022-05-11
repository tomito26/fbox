import { useEffect, useState } from "react";
import TvShow from "./TvShow";

const TvShows =  () =>{
    const[tvShows,setTvShows] = useState([]);

    useEffect(()=>{
        getTvShows()
    },[]);

    const getTvShows = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/tv/top_rated?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await rest.json();
        setTvShows(data.results)
    }

    return(
        <div className="movie-wrapper">
            {tvShows.map(tvShow => <TvShow key={tvShow.id} tvShow={tvShow}/>)}
        </div>
    );
};

export default TvShows