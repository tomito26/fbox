import { useEffect, useState } from "react";
import Trending from './Trending'

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
            {trendings.map(trending => <Trending key={trending.id} trending={trending}/>)}
        </div>
    );
};
export default Trendings;