import { useEffect, useState } from "react";
import { FaPlay,FaStar,FaRegHeart, FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Trending = ({ trending })=>{
    const[isHovering,setIsHovering] = useState(-1);
    const[trendingDetails,setTrendingDetails] = useState({});

    useEffect(()=>{
        const trenndingDetails = []
        const getTrendingDetails = async () =>{
          
            const rest = trending.media_type === "movie" ? await fetch(`https://api.themoviedb.org/3/movie/${trending.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`) : await fetch(`https://api.themoviedb.org/3/tv/${trending.id}?api_key=${process.env.REACT_APP_MOVIE_API_KEY}&language=en-US`);
            const data = await rest.json();
            
            setTrendingDetails(data)
        }
        getTrendingDetails()
    },[])

    const baseUrl = "https://image.tmdb.org/t/p/original/";
    const seriesReleaseDate =trending.first_air_date;
    const movieReleaseDate = !trending.release_date ? seriesReleaseDate.split("-")[0] : trending.release_date.split("-")[0];
   
    return(
        <div className="movie-card" onMouseOver={e =>setIsHovering(trending.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="movie-link" to={`/trending/${trending.id}`}>
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
                    <div className="movie-play-icon">
                        <p><FaPlay/></p>
                    </div>
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
                        <p className="country">
                            <span>Country:</span>
                           {!trendingDetails.production_countries ? "" : trendingDetails.production_countries.map((country,index)=><span className="country-item" key={index} style={{marginRight:"3px",color:"#ddd"}}>{`${country.name},`}</span>)}
                        </p>
                        <p className="genre">
                            <span>Genre:</span>
                            {!trendingDetails.genres ? "" : trendingDetails.genres.map(genre=><span key={genre.id} className="genre-item" style={{marginRight:"3px",color:"#ddd"}}>{`${genre.name},`}</span>)}
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
};

export default Trending;