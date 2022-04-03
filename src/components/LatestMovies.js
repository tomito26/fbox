import { useEffect, useState } from "react";
import LatestMovie from "./LatestMovie";

const LatestMovies =  () =>{
    const[latestMovies,setLatestMovies] = useState([]);
    useEffect(()=>{
        getLatestMovies()
    },[])

    const getLatestMovies = async () =>{
        const  rest = await fetch(`
        https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await rest.json();
        setLatestMovies(data.results) 
    }
    return(
        <div className="movie-wrapper">
            {latestMovies.map(movie => <LatestMovie key={movie.id} movie={movie}/>)}
        </div>
    );
};
export default LatestMovies;