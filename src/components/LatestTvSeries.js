import { useEffect, useState } from "react";
import LatestTvSerie from "./LatestTvSerie";

const LatestTvSeries = () =>{
    const[latestTvSeries,setLatestTvSeries] = useState([]);

    useEffect(()=>{
        getLatestTvSeries();
    },[]);

    const getLatestTvSeries = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/tv/airing_today?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await rest.json();
        setLatestTvSeries(data.results)
    }
   
    return(
        <div className="movie-wrapper">
            {latestTvSeries.map(tvSeries => <LatestTvSerie key={tvSeries.id} tvSeries={tvSeries}/>)}
        </div>
    );
};
export default LatestTvSeries;