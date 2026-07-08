import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircle,FaHeart,FaPlay, FaRegHeart, FaStar } from "react-icons/fa";
import { getMovie, imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";

const SimilarMovies = ({ similarMovie }) =>{
    const [similarMovieDetail,setSimilarMovieDetail] = useState({});
    const [isHovering,setIsHovering] = useState(-1);
    const { isSaved, toggleWatchlist } = useWatchlist();
    const saved = isSaved(similarMovie.id);
    useEffect(()=>{
        const abortCont = new AbortController();
        getMovie(similarMovie.id, abortCont.signal).then(({ data }) => {
            if (data) setSimilarMovieDetail(data);
        });

        return () => abortCont.abort();
    },[similarMovie.id])
    const releaseDate = similarMovie.release_date || "";
    const year = releaseDate.split("-");
   
    return(
        <div className="similar-movie-container" onMouseOver={e =>setIsHovering(similarMovieDetail.id)} onMouseOut={()=>setIsHovering(-1)}>
            <Link className="similar-movie-link" to={`/movie/${similarMovie.id}`}>
                <div className="similar-movie-poster">
                    <img
                        src={imageUrl(similarMovie.poster_path, "w342")}
                        alt={similarMovie.title}
                        loading="lazy"
                        style={{filter:isHovering < 0 ? "brightness(100%)" : "brightness(50%)"}}
                    />
                </div>
                <div className="similar-movie-footer">
                    <p className="movie-title">{similarMovie.title.length > 14  ? `${similarMovie.title.substring(0,13)}...` : similarMovie.title}</p>
                    <div className="movie-footer-details">
                        <p className="movie-time">
                            <span>
                                {year[0]}
                            </span>
                            <FaCircle className="circle-dot"/>
                            <span className="runtime">
                                {`${similarMovieDetail.runtime} min`}
                            </span>
                        </p>  
                        <p className="movie-tag">Movie</p>
                    </div>
                </div>
            </Link>
            <div className={isHovering > 0 ?  `similar-movie-overview` : "no-hover"}>
                <Link to={`/movie/${similarMovie.id}`} className="similar-movie-play">
                    <FaPlay/>
                </Link>
                <div className="similar-movie-overview-info">
                    <div className="similar-movie-overview-header">
                        <h4>{similarMovie.title}</h4>
                        <p className="similar-movie-rate"><FaStar className="star-rate"/>{similarMovie.vote_average}</p>
                        <p className="similar-movie-runtime">{`${similarMovieDetail.runtime} min`}</p>
                        <p className="similar-movie-tag">HD</p>
                    </div>
                    <div className="similar-movie-overview-details">
                        <p>{similarMovie.overview.length > 150 ? `${similarMovie.overview.substring(0,150)}...`: similarMovie.overview}</p>
                    </div>
                    <div className="category-section">
                        <h4>Country:</h4>
                        <p>{!similarMovieDetail.production_countries ? "" : similarMovieDetail.production_countries.map((country,index) => <span key={index} style={{marginRight:"3px"}}>{country.name}</span>)}</p>
                    </div>
                    <div className="category-section">
                        <h4>Genre:</h4>
                        <p>{!similarMovieDetail.genres ? "" : similarMovieDetail.genres.map((genre,index) => <span key={genre.id} style={{marginRight:"3px"}}>{`${genre.name},`}</span>)}</p>
                    </div>
                    <div className="similar-button">
                        <Link to={`/movie/${similarMovie.id}`} className="watchnow-btn">
                            <FaPlay className="similar-movies-play"/>
                            Watch Now
                        </Link>
                        <button
                            className={`add-to-list${saved ? " saved" : ""}`}
                            aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                            aria-pressed={saved}
                            onClick={() => toggleWatchlist({ ...similarMovie, media_type: "movie" })}
                        >
                            {saved ? <FaHeart className="heart"/> : <FaRegHeart className="heart"/>}
                        </button>
                    </div>
                </div>
            </div>
           

        </div>
    );
};

export default SimilarMovies;