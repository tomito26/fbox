import { useEffect,useState } from "react";
import RecommendedMovie from "./RecommendedMovie";

const RecommendedMovies = () =>{
    const [recommendedMovies,setRecommendedMovies] = useState([]);
    
    useEffect(()=>{
        getRecommendedMovies()
    },[]);

    const getRecommendedMovies = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await rest.json();
        setRecommendedMovies(data.results)
    }

    return(
        <div className="movie-wrapper">
            {recommendedMovies.map(movie=><RecommendedMovie key={movie.id} movie={movie}/>)}
        </div>
    );
};

export default RecommendedMovies;