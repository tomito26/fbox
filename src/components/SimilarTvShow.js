import { useEffect, useState } from "react";
import { FaCircle, FaPlay, FaRegHeart, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

const SimilarTvShow = ({ similarTvShow }) =>{
    const[isHovering,setIsHovering] = useState(-1);
    const [similarTvShowDetails,setSimilarTvShowDetails] = useState({});

    useEffect(()=>{
        const getSimilarTvShowDetails = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${similarTvShow.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setSimilarTvShowDetails(data);
        }
        getSimilarTvShowDetails();
    },[])

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    console.log(similarTvShowDetails)
    return(
        <div className="similar-movie-container" onMouseOver={e =>setIsHovering(similarTvShowDetails.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="similar-movie-link" to={`/${similarTvShow.id}`}>
                <div className="similar-movie-poster">
                    <img 
                        src={`${baseUrl}/${similarTvShow.poster_path}`} 
                        alt={similarTvShow.name}
                        style={{filter:isHovering < 0 ? "brightness(100%)" : "brightness(50%)"}} 
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
            <div className={isHovering > 0 ?  `similar-movie-overview` : "no-hover"}>
                <div className="similar-movie-play">
                    <FaPlay/>
                </div>
                <div className="similar-movie-overview-info">
                    <div className="similar-movie-overview-header">
                        <h4>{similarTvShow.name}</h4>
                        <p className="similar-movie-rate"><FaStar className="star-rate"/>{similarTvShow.vote_average}</p>
                        <p className="similar-movie-runtime">{`na min`}</p>
                        <p className="similar-movie-tag">HD</p>
                    </div>
                    <div className="similar-movie-overview-details">
                        <p>{similarTvShow.overview.length > 150 ? `${similarTvShow.overview.substring(0,150)}...`: similarTvShow.overview}</p>
                    </div>
                    <div className="category-section">
                        <h4>Country:</h4>
                        <p>{!similarTvShowDetails.production_countries ? "" : similarTvShowDetails.production_countries.map((country,index) => <span key={index} style={{marginRight:"3px"}}>{country.name}</span>)}</p>
                    </div>
                    <div className="category-section">
                        <h4>Genre:</h4>
                        <p>{!similarTvShowDetails.genres ? "" : similarTvShowDetails.genres.map((genre,index) => <span key={genre.id} style={{marginRight:"3px"}}>{`${genre.name},`}</span>)}</p>
                    </div>
                    <div className="similar-button">
                        <button className="watchnow-btn"><FaPlay className="similar-movies-play"/>Watch Now</button>
                        <button className="add-to-list"><FaRegHeart className="heart"/></button>
                    </div>
                </div>
            </div>
        </div>
    );

}
export default SimilarTvShow;
