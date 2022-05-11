import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const  Season = () =>{
    const[seasonDetails,setSeasonDetails] = useState([]);
    const { tvshowId,seasonNumber} = useParams();
    console.log(tvshowId)
    
    useEffect(()=>{
        const getSeasonDetails = async () =>{
            const res = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}/season/${seasonNumber}/episode/1?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await res.json()
            console.log(data);
        }
        getSeasonDetails()
    },[])

    return(<>Season {seasonNumber}</>)
}

export default Season;