import { useEffect, useState } from "react";
import { FaPlay,FaStar,FaRegHeart } from "react-icons/fa";
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
            <Link className="movie-link" to={`/tvSeries/${tvSeries.id}`}>
                <div className="movie-img">
                    <img src={`${baseUrl}/${tvSeries.poster_path}`} alt={tvSeries.name} />
                    <p className='movie-hd-tag'>HD</p>
                </div>
                <div className="movie-info">
                    <p className="movie-title">{tvSeries.name.length  > 25 ? `${tvSeries.name.substring(0,23)}...` : tvSeries.name}</p>
                    <p className="movie-footer "><span className="year">{`SS ${tvDetails.number_of_seasons} . EP ${!tvDetails.last_episode_to_air ? "" :tvDetails.last_episode_to_air.episode_number}`}</span><span className="movie-tag series-tag">Tv</span></p>
                </div>
            </Link>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <div className="movie-play-icon">
                        <p><FaPlay/></p>
                    </div>
                    <div className="movie-overview-wrapper">
                        <h3>{tvSeries.name}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{tvSeries.vote_average}</span>
                            <span>{year}</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p className="movie-overview-details">{tvSeries.overview.length  > 120 ? `${tvSeries.overview.substring(0,120)}...` : tvSeries.overview }</p>
                        <div className="overview-button">
                            <button className="watch-now-btn"><span className="watchnow-icon"><FaPlay className='watch-now-icon'/></span> Watch Now</button>
                            <p className="watchlist-icon"><FaRegHeart/></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LatestTvSerie;