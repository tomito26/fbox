import { useEffect, useState } from "react";
import { FaPlay,FaStar,FaRegHeart, FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const TvShow  = ({ tvShow }) =>{
    const[isHovering,setIsHovering] = useState(-1)
    const[tvShowDetails,setTvShowDetails] = useState({});

    useEffect(()=>{
        const getTvShowDetails = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvShow.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json()
            setTvShowDetails(data)
        }
        getTvShowDetails();
    },[]);

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const releaseYear = tvShow.first_air_date.split("-");
    const year = releaseYear[0];
 
    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(tvShow.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="movie-link" to={`/tvshow/${tvShow.id}`}>
                <div className="movie-img">
                    <img src={`${baseUrl}/${tvShow.poster_path}`} alt={tvShow.name} />
                    <p className='movie-hd-tag'>HD</p>
                </div>
                <div className="movie-info">
                    <p className="movie-title">{tvShow.name.length > 25 ? `${tvShow.name.substring(0,23)}...` : tvShow.name}</p>
                    <div className="movie-footer ">
                        <p className="year">
                            <span>{`SS ${tvShowDetails.number_of_seasons}`}</span> 
                            <span className="dot"><FaCircle className="dot-circle"/></span> 
                            <span>{`EP${!tvShowDetails.last_episode_to_air ? "" :tvShowDetails.last_episode_to_air.episode_number}`}</span>
                        </p>
                        <p className="movie-tag series-tag">Tv</p>
                    </div>
                    
                </div>
            </Link>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <div className="movie-play-icon">
                        <p><FaPlay/></p>
                    </div>
                    <div className="movie-overview-wrapper">
                        <h3>{tvShow.name}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{tvShow.vote_average}</span>
                            <span>{year}</span>
                            <span>na min</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p className="movie-overview-details">{tvShow.overview.length  > 120 ? `${tvShow.overview.substring(0,120)}...` : tvShow.overview }</p>
                        <p className="country">
                            <span>Country:</span>
                           {!tvShowDetails.production_countries ? "" : tvShowDetails.production_countries.map((country,index)=><span className="country-item" key={index} style={{marginRight:"3px",color:"#ddd"}}>{`${country.name},`}</span>)}
                        </p>
                        <p className="genre">
                            <span>Genre:</span>
                            {!tvShowDetails.genres ? "" : tvShowDetails.genres.map(genre=><span key={genre.id} className="genre-item" style={{marginRight:"3px",color:"#ddd"}}>{`${genre.name},`}</span>)}
                        </p>
                        <div className="overview-button">
                            <button className="watch-now-btn">
                                <span>
                                    <FaPlay className='watchnow-icon'/>
                                </span> 
                                Watch Now
                            </button>
                            <p className="watchlist-icon"><FaRegHeart/></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TvShow;