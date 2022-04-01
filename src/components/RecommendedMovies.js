import { useEffect,useState } from "react";

const RecommendedMovies = () =>{
    const [recommendedMovies,setRecommendedMovies] = useState([]);
    
    useEffect(()=>{
        getRecommendedMovies()
    },[]);

    const getRecommendedMovies = async () =>{
        const rest = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US&page=1`);
        const data = await rest.json();
        console.log(data)
    }

    return(<div>Movie</div>);
};

export default RecommendedMovies;