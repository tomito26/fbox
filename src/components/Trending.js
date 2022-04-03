import { useState } from "react";
import { FaPlay,FaStar,FaRegHeart } from "react-icons/fa";
import { Link } from "react-router-dom";

const Trending = ({ trending })=>{
    const[isHovering,setIsHovering] = useState(-1);
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
                    <p className="movie-footer">
                        <span className="year">{movieReleaseDate}</span>
                        <span className="movie-tag">{trending.media_type}</span>
                    </p>
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
                            <span className='overview-tag'>HD</span>
                        </p>
                        <p class="movie-overview-details">{trending.overview.length  > 150 ? `${trending.overview.substring(0,150)}...` : trending.overview }</p>
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

export default Trending;