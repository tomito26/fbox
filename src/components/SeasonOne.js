import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const SeasonOne = () =>{
    const[seasonDetails,setSeasonDetails] = useState([]);
    const tvshowId = useParams();

    useEffect(()=>{
        const season_number = 1;
        const getSeasonDetails = async () => {
            const res = await fetch(`https://api.themoviedb.org/3/tv/${tvshowId}/season/1?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`)
            const data = await res.json();
            console.log(data)
        };
        getSeasonDetails()
    });
    console.log(tvshowId)
    
    return(<>Season 1</>);
};

export default SeasonOne;