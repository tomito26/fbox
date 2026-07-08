import { useEffect, useState } from "react";
import Trending from './Trending'
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const Trendings = () =>{
    const[trendings,setTrendings] = useState([]);
    const [error,setError] = useState(null);
    useEffect(()=>{
        getTrendingMovies()
    },[]);

    const getTrendingMovies = async () =>{
        try {
            const data = await tmdbFetch("/trending/all/day");
            setTrendings(data.results)
        } catch (err) {
            setError("Couldn't load trending titles. Please try again later.");
        }
    }

    if (error) return <ErrorMessage message={error}/>;

    return(
        <div className="movie-wrapper">
            {trendings.map(trending => <Trending key={trending.id} trending={trending}/>)}
        </div>
    );
};
export default Trendings;