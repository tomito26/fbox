import { useEffect, useState } from "react";
import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getTvShow, imageUrl } from "../services/tmdb";

const SimilarTvShow = ({ similarTvShow }) =>{
    const [similarTvShowDetails,setSimilarTvShowDetails] = useState({});

    useEffect(()=>{
        const abortCont = new AbortController();
        getTvShow(similarTvShow.id, abortCont.signal).then(({ data }) => {
            if (data) setSimilarTvShowDetails(data);
        });
        return () => abortCont.abort();
    },[similarTvShow.id])

    return(
        <div className="similar-movie-container">
            <Link className="similar-movie-link" to={`/tvshows/${similarTvShow.id}`}>
                <div className="similar-movie-poster">
                    <img
                        src={imageUrl(similarTvShow.poster_path, "w342")}
                        alt={similarTvShow.name}
                        loading="lazy"
                    />
                </div>
                <div className="similar-movie-footer">
                    <p className="movie-title">{similarTvShow.name.length > 10  ? `${similarTvShow.name.substring(0,13)}...` : similarTvShow.name}</p>
                    <div className="movie-footer-details">
                        <p className="movie-time">
                            <span>
                                {`SS ${similarTvShowDetails.number_of_seasons}`}
                            </span>
                            <FaCircle className="circle-dot" style={{margin:"0 4px"}}/>
                            <span className="runtime">
                                {`EP ${!similarTvShowDetails.last_episode_to_air ? "": similarTvShowDetails.last_episode_to_air.episode_number}`}
                            </span>
                        </p>  
                        <p className="movie-tag">Tv</p>
                    </div>
                </div>
            </Link>
        </div>
    );

}
export default SimilarTvShow;
