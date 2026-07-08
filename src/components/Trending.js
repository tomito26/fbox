import { useEffect, useState } from "react";
import { FaPlay,FaStar,FaRegHeart, FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { tmdbFetch } from "../api/tmdb";

const Trending = ({ trending })=>{
    const[isHovering,setIsHovering] = useState(-1);
    const[trendingDetails,setTrendingDetails] = useState({});

    useEffect(()=>{
        const getTrendingDetails = async () =>{
            try {
                const path = trending.media_type === "movie" ? `/movie/${trending.id}` : `/tv/${trending.id}`;
                const data = await tmdbFetch(path, { language: "en-US" });
                setTrendingDetails(data)
            } catch (err) {
                console.error(err);
            }
        }
        getTrendingDetails()
    },[])

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const seriesReleaseDate =trending.first_air_date;
    const movieReleaseDate = !trending.release_date ? seriesReleaseDate.split("-")[0] : trending.release_date.split("-")[0];
   
    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(trending.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="movie-link" to={trending.media_type === "movie" ? `/movie/${trending.id}` : `/tvshows/${trending.id}`}>
                <div className="movie-img">
                    <img src={`${baseUrl}/${trending.poster_path}`} alt={trending.name} />
                    <p className='movie-hd-tag'>HD</p>
                </div>
                <div className="movie-info">
                    <p className="movie-title">
                        {!trending.title ? trending.name.length > 25 ? `${trending.name.substring(0,23)}...`:trending.name 
                            :
                            trending.title.length > 20 ? `${trending.title.substring(0,21)}...`:trending.title }
                    </p>
                    <div className="movie-footer">
                        <p className="year">
                            <span>{trending.media_type === "movie" ? movieReleaseDate : `SS ${trendingDetails.number_of_seasons}`}</span>
                            <span className="dot"><FaCircle className="dot-circle"/></span>
                            <span>{trending.media_type === "movie" ? `${trendingDetails.runtime} min` : `EP ${!trendingDetails.last_episode_to_air ? "" : trendingDetails.last_episode_to_air.episode_number}`}</span>
                        </p>
                        <p className="movie-tag">{trending.media_type}</p>
                    </div>
                </div>
            </Link>
            <div className={ isHovering > 0 ? "movie-overview" : "no-hover"}>
                <div className='movie-container'>
                    <Link to={trending.media_type === "movie" ? `/movie/${trending.id}` : `/tvshows/${trending.id}`} className="movie-play-icon">
                        <p><FaPlay/></p>
                    </Link>
                    <div className="movie-overview-wrapper">
                        <h3>{trending.name ||trending.title}</h3>
                        <p className="movie-overview-info">
                            <span className='movie-rating'><FaStar className='rate-icon'/>{trending.vote_average}</span>
                            <span>{movieReleaseDate}</span>
                            <span>{trending.media_type === "movie" ? `${trendingDetails.runtime} min` : `na min`}</span>
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p className="movie-overview-details">
                            {trending.overview.length  > 120 ? `${trending.overview.substring(0,120)}...` : trending.overview }
                        </p>
                        <div className="country">
                            <h4>Country:</h4>
                            <p>
                                {!trendingDetails.production_countries ? "" 
                                    : trendingDetails.production_countries.map((country,index)=>
                                    <span className="country-item" key={index} style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${country.name},`}
                                    </span>)
                                }
                            </p>
                        </div>
                        <div className="genre">
                            <h4>Genre:</h4>
                            <p>
                                {!trendingDetails.genres ? "" : trendingDetails.genres.map(genre=>
                                    <span key={genre.id} className="genre-item" style={{marginRight:"3px",color:"#ddd"}}>
                                        {`${genre.name},`}
                                    </span>)
                                }
                            </p>
                        </div>
                        <div className="overview-button">
                            <Link to={trending.media_type === "movie" ? `/movie/${trending.id}` : `/tvshows/${trending.id}`} className="watch-now-btn">
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

export default Trending;