import { useState,useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import Series from "./Series";
import Series2 from "./Series2";
import Series3 from "./Series3";
import Series4 from "./Series4";
import { tmdbFetch } from "../../api/tmdb";
import ErrorMessage from "../../components/ErrorMessage";
const TvSeries = () =>{
    const[tvShow,setTvShow] = useState([]);
    const[tvShow2,setTvShow2] = useState([]);
    const[tvShow3,setTvShow3] = useState([]);
    const[tvShow4,setTvShow4] = useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getTvSeries();
        getTvSeries2();
        getTvSeries3();
        getTvSeries4();
    },[])

    const getTvSeries = async () => {
        try {
            const data = await tmdbFetch("/tv/popular", { language: "en-US", page: 1 });
            setTvShow(data.results);
        } catch (err) {
            setError("Couldn't load TV series. Please try again later.");
        }
    };
    const getTvSeries2 = async () => {
        try {
            const data = await tmdbFetch("/tv/popular", { language: "en-US", page: 2 });
            setTvShow2(data.results);
        } catch (err) {
            setError("Couldn't load TV series. Please try again later.");
        }
    };
    const getTvSeries3 = async () => {
        try {
            const data = await tmdbFetch("/tv/popular", { language: "en-US", page: 3 });
            setTvShow3(data.results);
        } catch (err) {
            setError("Couldn't load TV series. Please try again later.");
        }
    };
    const getTvSeries4 = async () => {
        try {
            const data = await tmdbFetch("/tv/popular", { language: "en-US", page: 4 });
            setTvShow4(data.results);
        } catch (err) {
            setError("Couldn't load TV series. Please try again later.");
        }
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
            {error && <ErrorMessage message={error}/>}
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