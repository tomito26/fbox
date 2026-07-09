import { FaPlay, FaCheck } from "react-icons/fa";
import { imageUrl } from "../services/tmdb";
import { readProgress, isWatched, watchedFraction } from "../utils/watchProgress";

// Rich episode list for the TV detail page: a thumbnail (still), episode number
// + title, air date, runtime and overview per row — the streaming-standard
// layout, replacing the old numbered button grid. Watched episodes get a check;
// partially watched ones show a resume progress bar; the playing one is marked
// active. Falls back to a lightweight numbered grid when TMDB has no per-episode
// data for the season yet.

const EpisodeList = ({
  tvId,
  seasonNumber,
  episodes = [],
  loading,
  episodeCount = 0,
  currentEpisode,
  watchingActive,
  onPlay,
}) => {
  if (loading) {
    return (
      <div className="episode-list">
        {Array.from({ length: Math.min(episodeCount || 6, 8) }).map((_, i) => (
          <div className="episode-row episode-row-skeleton" key={i}>
            <div className="episode-still shimmer" />
            <div className="episode-row-lines">
              <div className="skeleton-line short shimmer" />
              <div className="skeleton-line shimmer" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // No detailed episode data — fall back to a compact numbered grid so the user
  // can still pick any episode.
  if (!episodes.length) {
    if (!episodeCount) return null;
    return (
      <div className="episode-grid">
        {Array.from({ length: episodeCount }, (_, i) => i + 1).map((ep) => (
          <button
            key={ep}
            className={`episode-btn${
              watchingActive && ep === currentEpisode ? " active" : ""
            }`}
            onClick={() => onPlay(ep)}
            aria-label={`Play episode ${ep}`}
          >
            {ep}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="episode-list">
      {episodes.map((ep) => {
        const saved = readProgress("tv", tvId, seasonNumber, ep.episode_number);
        const watched = isWatched(saved);
        const fraction = watchedFraction(saved);
        const active = watchingActive && ep.episode_number === currentEpisode;
        return (
          <button
            key={ep.id || ep.episode_number}
            className={`episode-row${active ? " active" : ""}`}
            onClick={() => onPlay(ep.episode_number)}
            aria-label={`Play episode ${ep.episode_number}${ep.name ? `: ${ep.name}` : ""}`}
            aria-pressed={active}
          >
            <div className="episode-still">
              {ep.still_path ? (
                <img src={imageUrl(ep.still_path, "w300")} alt="" loading="lazy" />
              ) : (
                <div className="episode-still-fallback">{ep.episode_number}</div>
              )}
              <span className="episode-still-play">
                <FaPlay />
              </span>
              {watched && (
                <span className="episode-watched" aria-label="Watched">
                  <FaCheck />
                </span>
              )}
              {!watched && fraction > 0 && (
                <span className="episode-progress">
                  <span style={{ width: `${Math.round(fraction * 100)}%` }} />
                </span>
              )}
            </div>
            <div className="episode-body">
              <div className="episode-head">
                <span className="episode-num">E{ep.episode_number}</span>
                <span className="episode-name">{ep.name || `Episode ${ep.episode_number}`}</span>
                {ep.runtime ? <span className="episode-runtime">{ep.runtime}m</span> : null}
              </div>
              {ep.air_date && <span className="episode-air">{ep.air_date}</span>}
              {ep.overview && <p className="episode-overview">{ep.overview}</p>}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default EpisodeList;
