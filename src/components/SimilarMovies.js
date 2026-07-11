import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaCircle, FaHeart, FaRegHeart } from "react-icons/fa";
import { getMovie, imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";

const SimilarMovies = ({ similarMovie }) =>{
    const [similarMovieDetail,setSimilarMovieDetail] = useState({});
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
    const title = similarMovie.title || "";
   
    return(
        <div className="similar-movie-container">
            <button
                className={`card-heart${saved ? " saved" : ""}`}
                aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                aria-pressed={saved}
                onClick={() => toggleWatchlist({ ...similarMovie, media_type: "movie" })}
            >
                {saved ? <FaHeart /> : <FaRegHeart />}
            </button>
            <Link className="similar-movie-link" to={`/movie/${similarMovie.id}`}>
                <div className="similar-movie-poster">
                    <img
                        src={imageUrl(similarMovie.poster_path, "w342")}
                        alt={title}
                        loading="lazy"
                    />
                </div>
                <div className="similar-movie-footer">
                    <p className="movie-title">{title.length > 14  ? `${title.substring(0,13)}...` : title}</p>
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
        </div>
    );
};

export default SimilarMovies;