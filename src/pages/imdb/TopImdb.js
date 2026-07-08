import { useEffect, useState } from "react";
import Imdb from "./Imdb";
import DropdownMenus from '../../components/categorySection/DropdownMenus'
import { tmdbFetch } from "../../api/tmdb";
import ErrorMessage from "../../components/ErrorMessage";

const TopImdb = () =>{
    const[trendings,setTrendings] = useState([]);
    const[trendings2,setTrendings2] = useState([]);
    const[trendings3,setTrendings3] = useState([]);
    const[trendings4,setTrendings4] = useState([]);
    const [error,setError] = useState(null);

    useEffect(()=>{
        getTrendingMovies();
        getTrendingMovies2();
        getTrendingMovies3();
        getTrendingMovies4();
    },[]);

    const getTrendingMovies = async () =>{
        try {
            const data = await tmdbFetch("/trending/all/week", { language: "en-US", page: 5 });
            setTrendings(data.results)
        } catch (err) {
            setError("Couldn't load Top IMDb titles. Please try again later.");
        }
    }
    const getTrendingMovies2 = async () =>{
        try {
            const data = await tmdbFetch("/trending/all/week", { language: "en-US", page: 6 });
            setTrendings2(data.results)
        } catch (err) {
            setError("Couldn't load Top IMDb titles. Please try again later.");
        }
    }
    const getTrendingMovies3 = async () =>{
        try {
            const data = await tmdbFetch("/trending/all/week", { language: "en-US", page: 7 });
            setTrendings3(data.results)
        } catch (err) {
            setError("Couldn't load Top IMDb titles. Please try again later.");
        }
    }
    const getTrendingMovies4 = async () =>{
        try {
            const data = await tmdbFetch("/trending/all/week", { language: "en-US", page: 8 });
            setTrendings4(data.results)
        } catch (err) {
            setError("Couldn't load Top IMDb titles. Please try again later.");
        }
    }

    return(
        <div className="movie-page">
            <div className="movie-header">
                <h2>
                    <span>Top IMDb</span>
                    <hr />
                </h2>
                <DropdownMenus/>
            </div>
            {error && <ErrorMessage message={error}/>}
            <div className="movie-wrapper">
                {
                    trendings.map(trending=> <Imdb trending={trending} key={trending.id}/>)
                }
            </div>
            <div className="movie-wrapper">
                {
                    trendings2.map(trending=> <Imdb trending={trending} key={trending.id}/>)
                }
            </div>
            <div className="movie-wrapper">
                {
                    trendings3.map(trending=> <Imdb trending={trending} key={trending.id}/>)
                }
            </div>
            <div className="movie-wrapper">
                {
                    trendings4.map(trending=> <Imdb trending={trending} key={trending.id}/>)
                }
            </div>
        </div>
    );
};
export default TopImdb;