import { useState,useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import Series from "./Series";
const TvSeries = () =>{
    const[tvShow,setTvShow] = useState([]);

    useEffect(()=>{
        getTvSeries()
    },[])

    const getTvSeries = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setTvShow(data.results);
    };
    return(
        <div className="movie-page">
            <div className="movie-header">
            <h2>
                    <span>Tv Series</span>
                    <hr />
                </h2>
                <DropdownMenus/>
            </div>
            <div className="movie-wrapper">
                { tvShow.map(tvShow=> <Series tvShow={tvShow} key={tvShow.id} />) }
            </div>
        </div>
    );
};

export default TvSeries;