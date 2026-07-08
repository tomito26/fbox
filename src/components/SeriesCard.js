import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";

// Single reusable TV-series card. The hover affordance is the in-place poster
// lift + zoom/darken (see .movie-card:hover in App.css) — the old escaping
// detail popup (and its per-hover /tv/{id} fetch) has been removed.
const SeriesCard = ({ tvShow }) => {
  const { isSaved, toggleWatchlist } = useWatchlist();
  const saved = isSaved(tvShow.id);

  const year = tvShow.first_air_date ? tvShow.first_air_date.split("-")[0] : "";
  const name = tvShow.name || "";

  return (
    <div className="movie-card">
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
              <span>{year}</span>
            </p>
            <p className="movie-tag series-tag">Tv</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default SeriesCard;
