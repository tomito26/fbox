import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tmdbFetch } from "../api/tmdb";

const  Season = () =>{
    const[seasonDetails,setSeasonDetails] = useState([]);
    const { tvshowId,seasonNumber} = useParams();

    useEffect(()=>{
        const getSeasonDetails = async () =>{
            try {
                const data = await tmdbFetch(`/tv/${tvshowId}/season/${seasonNumber}/episode/1`, { language: "en-US" });
                setSeasonDetails(data);
            } catch (err) {
                console.error(err);
            }
        }
        getSeasonDetails()
    },[tvshowId,seasonNumber])

    return(<>Season {seasonNumber}</>)
}

export default Season;