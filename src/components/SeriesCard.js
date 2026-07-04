import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaPlay, FaCircle, FaHeart, FaRegHeart, FaStar } from "react-icons/fa";
import { getTvShow, imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";

// Single reusable TV-series card. Replaces the former Series / Series2 /
// Series3 / Series4 copies.
const SeriesCard = ({ tvShow }) => {
  const [tvShowDetails, setTvShowDetails] = useState({});
  const [isHovering, setIsHovering] = useState(false);
  const { isSaved, toggleWatchlist } = useWatchlist();
  const saved = isSaved(tvShow.id);

  useEffect(() => {
    let active = true;
    getTvShow(tvShow.id).then(({ data }) => {
      if (active && data) setTvShowDetails(data);
    });
    return () => {
      active = false;
    };
  }, [tvShow.id]);

  const year = tvShow.first_air_date ? tvShow.first_air_date.split("-")[0] : "";
  const name = tvShow.name || "";
  const overview = tvShow.overview || "";
  const lastEpisode = tvShowDetails.last_episode_to_air?.episode_number ?? "";

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
        onClick={() => toggleWatchlist({ ...tvShow, media_type: "tv" })}
      >
        {saved ? <FaHeart /> : <FaRegHeart />}
      </button>
      <Link className="movie-link" to={`/tvshows/${tvShow.id}`}>
        <div className="movie-img">
          <img src={imageUrl(tvShow.poster_path, "w342")} alt={name} loading="lazy" />
          <p className="movie-hd-tag">HD</p>
        </div>
        <div className="movie-info">
          <p className="movie-title">
            {name.length > 25 ? `${name.substring(0, 23)}...` : name}
          </p>
          <div className="movie-footer">
            <p className="year">
              <span>{`SS ${tvShowDetails.number_of_seasons ?? ""}`}</span>
              <span className="dot"><FaCircle className="dot-circle" /></span>
              <span>{`EP${lastEpisode}`}</span>
            </p>
            <p className="movie-tag series-tag">Tv</p>
          </div>
        </div>
      </Link>
      <div className={isHovering ? "movie-overview" : "no-hover"}>
        <div className="movie-container">
          <Link to={`/tvshows/${tvShow.id}`} className="movie-play-icon">
            <p><FaPlay /></p>
          </Link>
          <div className="movie-overview-wrapper">
            <h3>{name}</h3>
            <p className="movie-overview-info">
              <span className="movie-rating"><FaStar className="rate-icon" />{tvShow.vote_average}</span>
              <span>{year}</span>
              <span>na min</span>
              <span className="overview-tag">HD</span>
            </p>
            <p className="movie-overview-details">
              {overview.length > 120 ? `${overview.substring(0, 120)}...` : overview}
            </p>
            <div className="country">
              <h4>Country:</h4>
              <p>
                {(tvShowDetails.production_countries || []).map((country, index) => (
                  <span className="country-item muted" key={index}>{`${country.name},`}</span>
                ))}
              </p>
            </div>
            <div className="genre">
              <h4>Genre:</h4>
              <p>
                {(tvShowDetails.genres || []).map((genre) => (
                  <span key={genre.id} className="genre-item muted">{`${genre.name},`}</span>
                ))}
              </p>
            </div>
            <div className="overview-button">
              <Link to={`/tvshows/${tvShow.id}`} className="watch-now-btn">
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

export default SeriesCard;
