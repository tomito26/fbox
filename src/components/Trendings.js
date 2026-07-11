import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import SeriesCard from "./SeriesCard";

const Trendings = () =>{
    const[trendings,setTrendings] = useState([]);
    useEffect(()=>{
        getTrendingMovies()
    },[]);

    const getTrendingMovies = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/day?api_key=${process.env.REACT_APP_MOVIE_API_KEY}`);
        const data = await rest.json();
        setTrendings(data.results)
    }
    
    return(
        <div className="movie-wrapper">
            {trendings
                .filter(trending => trending.media_type === "movie" || trending.media_type === "tv")
                .map(trending =>
                    trending.media_type === "movie"
                        ? <MovieCard key={trending.id} movie={trending}/>
                        : <SeriesCard key={trending.id} tvShow={trending}/>
                )}
        </div>
    );
};
export default Trendings;