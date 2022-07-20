import { useEffect, useState } from "react";
import Imdb from "./Imdb";
import DropdownMenus from '../../components/categorySection/DropdownMenus'

const TopImdb = () =>{
    const[trendings,setTrendings] = useState([]);
    const[trendings2,setTrendings2] = useState([]);
    const[trendings3,setTrendings3] = useState([]);
    const[trendings4,setTrendings4] = useState([]);

    useEffect(()=>{
        getTrendingMovies();
        getTrendingMovies2();
        getTrendingMovies3();
        getTrendingMovies4();
    },[]);

    const getTrendingMovies = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=5`);
        const data = await rest.json();
        setTrendings(data.results)
    }
    const getTrendingMovies2 = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=6`);
        const data = await rest.json();
        setTrendings2(data.results)
    }
    const getTrendingMovies3 = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=7`);
        const data = await rest.json();
        setTrendings3(data.results)
    }
    const getTrendingMovies4 = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=8`);
        const data = await rest.json();
        setTrendings4(data.results)
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