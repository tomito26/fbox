import { useEffect,useState } from "react";
import RecommendedMovie from "./RecommendedMovie";
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const RecommendedMovies = () =>{
    const [recommendedMovies,setRecommendedMovies] = useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getRecommendedMovies()
    },[]);

    const getRecommendedMovies = async () =>{
        try {
            const data = await tmdbFetch("/movie/popular", { language: "en-US", page: 1 });
            setRecommendedMovies(data.results)
        } catch (err) {
            setError("Couldn't load recommended movies. Please try again later.");
        }
    }

    if (error) return <ErrorMessage message={error}/>;

    return(
        <div className="movie-wrapper">
            {recommendedMovies.map(movie=><RecommendedMovie key={movie.id} movie={movie}/>)}
        </div>
    );
};

export default RecommendedMovies;