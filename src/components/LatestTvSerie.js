import { useEffect, useState } from "react";
import { FaPlay,FaStar,FaRegHeart, FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const LatestTvSerie = ({ tvSeries }) =>{
    const[isHovering,setIsHovering] = useState(-1);
    const[tvDetails,setTvDetails] = useState({});

    useEffect(()=>{
        const getTvDetails = async () =>{
            const rest = await fetch(`https://api.themoviedb.org/3/tv/${tvSeries.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            setTvDetails(data)
        };
        getTvDetails()
    },[])

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const releaseYear = tvSeries.first_air_date.split("-");
    const year = releaseYear[0];
    
    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(tvSeries.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="movie-link" to={`/tvshows/${tvSeries.id}`}>
                <div className="movie-img">
                    <img src={`${baseUrl}/${tvSeries.poster_path}`} alt={tvSeries.name} />
                    <p className='movie-hd-tag'>HD</p>
                </div>
                <div className="movie-info">
                    <p className="movie-title">{tvSeries.name.length  > 25 ? `${tvSeries.name.substring(0,23)}...` : tvSeries.name}</p>
                    <div className="movie-footer">
                        <p className="year">
                            <span>{`SS ${tvDetails.number_of_seasons}`}</span>
                            <span className="dot"><FaCircle className="dot-circle"/></span>
                            <span>{ `EP ${!tvDetails.last_episode_to_air ? "" : tvDetails.last_episode_to_air.episode_number}`}</span>
                        </p>
                        <p className="movie-tag">Tv</p>
                    </div>
                </div>
            </Link>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <Link to={`/tvshows/${tvSeries.id}`} className="movie-play-icon">
                        
                        <p><FaPlay/></p>
                    </Link>
                    <div className="movie-overview-wrapper">
                        <h3>{tvSeries.name}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{tvDetails.vote_average}</span>
                            <span>{year}</span>
                            <span>na min</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p className="movie-overview-details">{tvSeries.overview.length  > 120 ? `${tvSeries.overview.substring(0,120)}...` : tvSeries.overview }</p>
                        <div className="country">
                            <h4>Country:</h4>
                            <p>
                                {!tvDetails.production_countries ? "" : tvDetails.production_countries.map((country,index)=>
                                    <span className="country-item" key={index} style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${country.name},`}
                                    </span>)
                                }
                            </p>
                        </div>
                        <div className="genre">
                            <h4>Genre:</h4>
                            <p>
                                {!tvDetails.genres ? "" : tvDetails.genres.map(genre=>
                                    <span key={genre.id} className="genre-item" style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${genre.name},`}
                                    </span>)
                                }
                            </p>
                        </div>
                        <div className="overview-button">
                            <Link to={`/tvshows/${tvSeries.id}`} className="watch-now-btn">
                                <span>
                                    <FaPlay className='watchnow-icon'/>
                                </span> 
                                Watch Now
                            </Link>
                            <p className="watchlist-icon"><FaRegHeart/></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LatestTvSerie;