import { useEffect, useState } from "react";
import LatestTvSerie from "./LatestTvSerie";
import { tmdbFetch } from "../api/tmdb";
import ErrorMessage from "./ErrorMessage";

const LatestTvSeries = () =>{
    const[latestTvSeries,setLatestTvSeries] = useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getLatestTvSeries();
    },[]);

    const getLatestTvSeries = async () =>{
        try {
            const data = await tmdbFetch("/tv/on_the_air", { language: "en-US", page: 1 });
            setLatestTvSeries(data.results)
        } catch (err) {
            setError("Couldn't load latest TV series. Please try again later.");
        }
    }

    if (error) return <ErrorMessage message={error}/>;

    return(
        <div className="movie-wrapper">
            {latestTvSeries.map(tvSeries => <LatestTvSerie key={tvSeries.id} tvSeries={tvSeries}/>)}
        </div>
    );
};
export default LatestTvSeries;