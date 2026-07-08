import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { tmdbFetch } from "../api/tmdb";

const SeasonOne = () =>{
    const[seasonDetails,setSeasonDetails] = useState([]);
    const { tvshowId } = useParams();

    useEffect(()=>{
        const getSeasonDetails = async () => {
            try {
                const data = await tmdbFetch(`/tv/${tvshowId}/season/1`, { language: "en-US" });
                setSeasonDetails(data);
            } catch (err) {
                console.error(err);
            }
        };
        getSeasonDetails()
    },[tvshowId]);

    return(<>Season 1</>);
};

export default SeasonOne;