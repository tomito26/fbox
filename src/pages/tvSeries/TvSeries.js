import { useState,useEffect } from "react";
const TvSeries = () =>{
    const[tvSeries,setTvSeries] = useState([]);

    useEffect(()=>{
        getTvSeries()
    },[])

    const getTvSeries = async () => {
        const rest = fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_MOVIE_API}&language=en-US&page=1`);
    }
    return(
        <div>TvSeries</div>
    );
};

export default TvSeries;