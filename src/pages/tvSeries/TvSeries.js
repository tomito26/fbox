import { useState,useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import Series from "./Series";
import Series2 from "./Series2";
import Series3 from "./Series3";
import Series4 from "./Series4";
const TvSeries = () =>{
    const[tvShow,setTvShow] = useState([]);
    const[tvShow2,setTvShow2] = useState([]);
    const[tvShow3,setTvShow3] = useState([]);
    const[tvShow4,setTvShow4] = useState([]);

    useEffect(()=>{
        getTvSeries();
        getTvSeries2();
        getTvSeries3();
        getTvSeries4();
    },[])

    const getTvSeries = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await res.json();
        setTvShow(data.results);
    };
    const getTvSeries2 = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=2`);
        const data = await res.json();
        setTvShow2(data.results);
    };
    const getTvSeries3 = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=3`);
        const data = await res.json();
        setTvShow3(data.results);
    };
    const getTvSeries4 = async () => {
        const res = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=4`);
        const data = await res.json();
        setTvShow4(data.results);
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
            <div className="movie-wrapper">
                { tvShow2.map(tvShow=> <Series2 tvShow={tvShow} key={tvShow.id} />) }
            </div>
            <div className="movie-wrapper">
                { tvShow3.map(tvShow=> <Series3 tvShow={tvShow} key={tvShow.id} />) }
            </div>
            <div className="movie-wrapper">
                { tvShow4.map(tvShow=> <Series4 tvShow={tvShow} key={tvShow.id} />) }
            </div>
        </div>
    );
};

export default TvSeries;