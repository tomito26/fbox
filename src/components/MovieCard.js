import { Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";

// Single reusable movie card. The hover affordance is the in-place poster
// lift + zoom/darken (see .movie-card:hover in App.css) — the old escaping
// detail popup (and its per-hover /movie/{id} fetch) has been removed.
const MovieCard = ({ movie }) => {
  const { isSaved, toggleWatchlist } = useWatchlist();
  const saved = isSaved(movie.id);

  const year = movie.release_date ? movie.release_date.split("-")[0] : "";
  const title = movie.title || "";

  return (
    <div className="movie-card">
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
            </p>
            <p className="movie-tag">movie</p>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default MovieCard;
