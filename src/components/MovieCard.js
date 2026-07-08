import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaCircle, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { getMovie, imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";

// Single reusable movie card. Replaces the former MoviePage / MoviePage2 /
// MoviesPage3 / MoviePage4 copies, which were byte-for-byte identical.
const MovieCard = ({ movie }) => {
  const [movieDetails, setMovieDetails] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const { isSaved, toggleWatchlist } = useWatchlist();
  const saved = isSaved(movie.id);

  // Detail (runtime/genres/country) is only needed for the hover overview, so we
  // fetch it lazily on first hover instead of on mount. A homepage renders 60-80
  // cards at once; fetching per card on mount was an N+1 storm of TMDB calls for
  // data the user often never sees (the overview is CSS-hidden on the home rows).
  const controllerRef = useRef(null);
  const requestedRef = useRef(false);

  const loadDetails = () => {
    if (requestedRef.current) return;
    requestedRef.current = true;
    controllerRef.current = new AbortController();
    getMovie(movie.id, controllerRef.current.signal).then(({ data }) => {
      if (data) setMovieDetails(data);
    });
  };

  useEffect(() => () => controllerRef.current?.abort(), []);

  const handleHover = () => {
    setIsHovering(true);
    loadDetails();
  };

  const year = movie.release_date ? movie.release_date.split("-")[0] : "";
  const title = movie.title || "";
  const overview = movie.overview || "";

  return (
    <div
      className="movie-card"
      onMouseOver={handleHover}
      onMouseOut={() => setIsHovering(false)}
    >
      <button
        className={`card-heart${saved ? " saved" : ""}`}
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        aria-pressed={saved}
        onClick={() => toggleWatchlist({ ...movie, media_type: "movie" })}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
      </button>
      <Link className="movie-link" to={`/movie/${movie.id}`}>
        <div className="movie-img">
          <img src={imageUrl(movie.poster_path, "w342")} alt={title} loading="lazy" />
          <p className="movie-hd-tag">HD</p>
        </div>
        <div className="movie-info">
          <p className="movie-title">
            {title.length > 22 ? `${title.substring(0, 21)}...` : title}
          </p>
          <div className="movie-footer">
            <p className="year">
              <span>{year}</span>
              {movieDetails.runtime ? (
                <>
                  <span className="dot"><FaCircle className="dot-circle" /></span>
                  <span>{`${movieDetails.runtime} min`}</span>
                </>
              ) : null}
            </p>
            <p className="movie-tag">movie</p>
          </div>
        </div>
      </Link>
      <div className={isHovering ? "movie-overview" : "no-hover"}>
        <div className="movie-container">
          <Link to={`/movie/${movie.id}`} className="movie-play-icon">
            <p><FaPlay /></p>
          </Link>
          <div className="movie-overview-wrapper">
            <h3>{title}</h3>
            <p className="movie-overview-info">
              <span className="movie-rating"><FaStar className="rate-icon" />{movie.vote_average}</span>
              <span>{year}</span>
              <span>{movieDetails.runtime ? `${movieDetails.runtime} min` : ""}</span>
              <span className="overview-tag">HD</span>
            </p>
            <p className="movie-overview-details">
              {overview.length > 120 ? `${overview.substring(0, 120)}...` : overview}
            </p>
            <div className="country">
              <h4>Country:</h4>
              <p>
                {(movieDetails.production_countries || []).map((country, index) => (
                  <span className="country-item muted" key={index}>{`${country.name},`}</span>
                ))}
              </p>
            </div>
            <div className="genre">
              <h4>Genre:</h4>
              <p>
                {(movieDetails.genres || []).map((genre) => (
                  <span key={genre.id} className="genre-item muted">{`${genre.name},`}</span>
                ))}
              </p>
            </div>
            <div className="overview-button">
              <Link to={`/movie/${movie.id}`} className="watch-now-btn">
                <span><FaPlay className="watchnow-icon" /></span>
                Watch Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
