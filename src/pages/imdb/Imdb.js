import { useEffect, useState } from "react";
import { FaCircle, FaPlay, FaHeart, FaRegHeart, FaStar, FaFilm } from "react-icons/fa";
import { Link } from "react-router-dom";
import { getMovie, getTvShow, imageUrl } from "../../services/tmdb";
import { useWatchlist } from "../../Context/WatchlistContext";

const Imdb = ({ trending }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [trendingDetails, setTrendingDetails] = useState({});
  const { isSaved, toggleWatchlist } = useWatchlist();
  const saved = isSaved(trending.id);

  const isMovie = trending.media_type === "movie";
  const to = isMovie ? `/movie/${trending.id}` : `/tvshows/${trending.id}`;
  const displayTitle = trending.title || trending.name || "";
  const overview = trending.overview || "";
  const rawDate = trending.release_date || trending.first_air_date || "";
  const releaseYear = rawDate ? rawDate.split("-")[0] : "";

  useEffect(() => {
    let active = true;
    const fetchDetails = isMovie ? getMovie : getTvShow;
    fetchDetails(trending.id).then(({ data }) => {
      if (active && data) setTrendingDetails(data);
    });
    return () => {
      active = false;
    };
  }, [trending.id, isMovie]);

  return (
    <div
      className="movie-card"
      onMouseOver={() => setIsHovering(true)}
      onMouseOut={() => setIsHovering(false)}
    >
      <button
        className={`card-heart${saved ? " saved" : ""}`}
        aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
        aria-pressed={saved}
        onClick={() => toggleWatchlist(trending)}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
      </button>
      <Link className="movie-link" to={to}>
        <div className="movie-img">
          {trending.poster_path ? (
            <img src={imageUrl(trending.poster_path, "w342")} alt={displayTitle} loading="lazy" />
          ) : (
            <div className="poster-fallback" aria-label={displayTitle}>
              <FaFilm />
              <span>{displayTitle}</span>
            </div>
          )}
          <p className="movie-hd-tag">HD</p>
        </div>
        <div className="movie-info">
          <p className="movie-title">
            {displayTitle.length > 22 ? `${displayTitle.substring(0, 21)}...` : displayTitle}
          </p>
          <div className="movie-footer">
            <p className="year">
              <span>{isMovie ? releaseYear : `SS ${trendingDetails.number_of_seasons ?? ""}`}</span>
              <span className="dot"><FaCircle className="dot-circle" /></span>
              <span>
                {isMovie
                  ? trendingDetails.runtime
                    ? `${trendingDetails.runtime} min`
                    : ""
                  : `EP ${trendingDetails.last_episode_to_air?.episode_number ?? ""}`}
              </span>
            </p>
            <p className="movie-tag">{trending.media_type}</p>
          </div>
        </div>
      </Link>
      <div className={isHovering ? "movie-overview" : "no-hover"}>
        <div className="movie-container">
          <Link to={to} className="movie-play-icon">
            <p><FaPlay /></p>
          </Link>
          <div className="movie-overview-wrapper">
            <h3>{displayTitle}</h3>
            <p className="movie-overview-info">
              <span className="movie-rating"><FaStar className="rate-icon" />{trending.vote_average}</span>
              <span>{releaseYear}</span>
              <span>{isMovie && trendingDetails.runtime ? `${trendingDetails.runtime} min` : "na min"}</span>
              <span className="overview-tag">HD</span>
            </p>
            <p className="movie-overview-details">
              {overview.length > 120 ? `${overview.substring(0, 120)}...` : overview}
            </p>
            <div className="country">
              <h4>Country:</h4>
              <p>
                {(trendingDetails.production_countries || []).map((country, index) => (
                  <span className="country-item muted" key={index}>{`${country.name},`}</span>
                ))}
              </p>
            </div>
            <div className="genre">
              <h4>Genre:</h4>
              <p>
                {(trendingDetails.genres || []).map((genre) => (
                  <span key={genre.id} className="genre-item muted">{`${genre.name},`}</span>
                ))}
              </p>
            </div>
            <div className="overview-button">
              <Link to={to} className="watch-now-btn">
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

export default Imdb;
