import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationCircle,
  FaHeart,
  FaPlay,
  FaRegHeart,
  FaShareAlt,
  FaStar,
  FaUser,
} from "react-icons/fa";
import { imageUrl } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";
import { shareNative } from "../utils/share";
import StreamPlayer from "./StreamPlayer";

// Shared presentational shell for the movie and TV detail pages. Movie.js and
// TvShowVideos.js fetch + normalize their data, then hand it to this component
// so the ~90% identical markup (and its bugs) lives in exactly one place.

const OVERVIEW_LIMIT = 280;

// Join a list of TMDB objects by name, e.g. "Action, Drama". Avoids the old
// per-item trailing comma ("Action,Drama,").
const names = (list = []) =>
  list
    .map((item) => item?.name)
    .filter(Boolean)
    .join(", ");

const MediaDetails = ({
  mediaType,
  details = {},
  video,
  casts = [],
  directors = [],
  similar = [],
  keywords = [],
  loading,
  error,
  renderSimilar,
  extras,
  streamSeason = 1,
  streamEpisode = 1,
}) => {
  const [expanded, setExpanded] = useState(false);
  // Only mount the heavy YouTube iframe once the user actually clicks play
  // (facade pattern) — avoids loading YouTube's player + cookies on every visit.
  const [playing, setPlaying] = useState(false);
  // Same facade approach for the full-stream (Vidking) player.
  const [watching, setWatching] = useState(false);
  const { isSaved, toggleWatchlist } = useWatchlist();
  const trailerRef = useRef(null);
  const streamRef = useRef(null);

  // Reset back to the facade when navigating to a different title's trailer.
  useEffect(() => {
    setPlaying(false);
  }, [video?.key]);

  // Collapse the stream player when the title changes.
  useEffect(() => {
    setWatching(false);
  }, [details.id]);

  if (loading) {
    return (
      <div className="movie-video-container">
        <div className="detail-hero detail-hero-skeleton">
          <div className="detail-hero-inner">
            <div className="detail-skeleton-poster shimmer" />
            <div className="detail-skeleton-lines">
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line short shimmer" />
              <div className="skeleton-line shimmer" />
              <div className="skeleton-line shimmer" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="detail-error">
        <FaExclamationCircle style={{ fontSize: "30px", marginBottom: "10px" }} />
        <p>We couldn't load this title. Please check your connection and try again.</p>
      </div>
    );
  }

  const isMovie = mediaType === "movie";
  const title = isMovie ? details.title : details.name;
  const releaseDate = isMovie ? details.release_date : details.first_air_date;
  const year = releaseDate ? releaseDate.split("-")[0] : "";
  const rating =
    details.vote_average != null ? Number(details.vote_average).toFixed(1) : "";

  // Movies have a single runtime; shows expose per-episode runtime plus a
  // season/episode count (replaces the old hardcoded "na min").
  const runtimeText = isMovie
    ? details.runtime
      ? `${details.runtime} min`
      : ""
    : [
        details.episode_run_time?.[0] ? `${details.episode_run_time[0]} min` : "",
        details.number_of_seasons
          ? `${details.number_of_seasons} season${details.number_of_seasons > 1 ? "s" : ""}`
          : "",
      ]
        .filter(Boolean)
        .join(" · ");

  const overview = details.overview || "";
  const isLong = overview.length > OVERVIEW_LIMIT;
  const overviewText =
    isLong && !expanded ? `${overview.substring(0, OVERVIEW_LIMIT)}…` : overview;

  const saved = isSaved(details.id);
  const topCast = casts.slice(0, 15);
  const genres = details.genres || [];

  // Play jumps to and starts the trailer (the site only carries trailers, not
  // full streams). Guarded so it's a no-op when there's no trailer to show.
  const handlePlay = () => {
    setPlaying(true);
    trailerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  // Watch Now reveals + scrolls to the full-stream (Vidking) player.
  const handleWatch = () => {
    setWatching(true);
    streamRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const handleShare = () =>
    shareNative({ url: window.location.href, text: title || "Watch on fbox.to" });

  const infoRow = (label, value) =>
    value ? (
      <div className="movie-category">
        <h4 className="movie-sub-header">{label}</h4>
        <p>{value}</p>
      </div>
    ) : null;

  return (
    <div className="movie-video-container">
      {/* Cinematic hero: darkened backdrop art behind poster + title + actions. */}
      <section
        className="detail-hero"
        style={
          details.backdrop_path
            ? {
                backgroundImage: `linear-gradient(to right, rgba(10,13,20,0.96) 0%, rgba(10,13,20,0.78) 45%, rgba(10,13,20,0.45) 100%), linear-gradient(to top, #0a0d14 3%, rgba(10,13,20,0.15) 60%), url(${imageUrl(
                  details.backdrop_path,
                  "w1280"
                )})`,
              }
            : undefined
        }
      >
        <div className="detail-hero-inner">
          <div className="detail-hero-poster">
            {details.poster_path ? (
              <img src={imageUrl(details.poster_path, "w500")} alt={title} />
            ) : (
              <div className="movie-poster-fallback">No image</div>
            )}
          </div>
          <div className="detail-hero-content">
            <h1 className="detail-title">{title}</h1>
            <div className="detail-meta">
              <span className="meta-badge">HD</span>
              {rating && (
                <span className="meta-rating">
                  <FaStar className="star-icon" /> {rating}
                </span>
              )}
              {year && <span>{year}</span>}
              {runtimeText && <span>{runtimeText}</span>}
            </div>
            {genres.length > 0 && (
              <div className="detail-genres">
                {genres.map((g) => (
                  <Link
                    key={g.id}
                    className="genre-chip"
                    to={`/browse?media=${mediaType}&genre=${g.id}&title=${encodeURIComponent(
                      g.name
                    )}`}
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}
            {overview && (
              <p className="overview-text">
                {overviewText}{" "}
                {isLong && (
                  <button
                    className="read-more"
                    onClick={() => setExpanded((prev) => !prev)}
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </p>
            )}
            <div className="detail-actions">
              {details.id && (
                <button className="detail-play-btn" onClick={handleWatch}>
                  <FaPlay /> Watch Now
                </button>
              )}
              {video && (
                <button className="detail-trailer-btn" onClick={handlePlay}>
                  <FaPlay /> Trailer
                </button>
              )}
              {details.id && (
                <button
                  className={`detail-heart${saved ? " saved" : ""}`}
                  aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                  aria-pressed={saved}
                  onClick={() =>
                    toggleWatchlist({ ...details, media_type: mediaType })
                  }
                >
                  {saved ? <FaHeart /> : <FaRegHeart />}
                  <span>{saved ? "In your list" : "Add to list"}</span>
                </button>
              )}
              <button
                className="detail-share-btn"
                onClick={handleShare}
                aria-label="Share"
              >
                <FaShareAlt /> <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Full-stream player (Vidking). Facade until the user clicks Watch Now so
          the embed isn't loaded on every visit. */}
      {details.id && (
        <section className="trailer-section stream-section" ref={streamRef}>
          <h4 className="section-heading">
            <span>{isMovie ? "Watch Movie" : "Watch Episode"}</span>
          </h4>
          <div
            className="video-wrapper"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${imageUrl(
                details.backdrop_path,
                "w1280"
              )})`,
            }}
          >
            <div className="trailer">
              {watching ? (
                <StreamPlayer
                  mediaType={mediaType}
                  id={details.id}
                  season={streamSeason}
                  episode={streamEpisode}
                  title={title}
                />
              ) : (
                <button
                  className="trailer-facade"
                  onClick={handleWatch}
                  aria-label={`Watch ${title || "now"}`}
                >
                  <span className="trailer-play-btn">
                    <FaPlay />
                  </span>
                  <span className="trailer-label">Watch Now</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {extras}

      {/* Trailer moved below the hero into its own section (Play jumps here). */}
      {video && (
        <section className="trailer-section" ref={trailerRef}>
          <h4 className="section-heading">
            <span>Trailer</span>
          </h4>
          <div
            className="video-wrapper"
            style={{
              backgroundImage: `linear-gradient(rgba(0,0,0,0.6),rgba(0,0,0,0.6)), url(${imageUrl(
                details.backdrop_path,
                "w1280"
              )})`,
            }}
          >
            <div className="trailer">
              {playing ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  title={`${title || "Title"} trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <button
                  className="trailer-facade"
                  onClick={() => setPlaying(true)}
                  aria-label={`Play ${title || "trailer"}`}
                  style={{
                    backgroundImage: `url(https://i.ytimg.com/vi/${video.key}/hqdefault.jpg)`,
                  }}
                >
                  <span className="trailer-play-btn">
                    <FaPlay />
                  </span>
                  <span className="trailer-label">Play trailer</span>
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="movie-items-wrapper">
        <div className="detail-main">
          <div className="detail-facts">
            <h4 className="section-heading">
              <span>Details</span>
            </h4>
            {infoRow("Country", names(details.production_countries))}
            {infoRow("Release", releaseDate)}
            {infoRow("Director", names(directors))}
            {infoRow("Production", names(details.production_companies))}

            {keywords.length > 0 && (
              <div className="movie-category tags-row">
                <h4 className="movie-sub-header">Tags</h4>
                <div className="tag-chips">
                  {keywords.slice(0, 12).map((kw) => (
                    <span className="tag-chip" key={kw.id}>
                      {kw.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {topCast.length > 0 && (
            <div className="cast-section">
              <h4 className="section-heading">
                <span>Cast</span>
              </h4>
              <div className="cast-strip">
                {topCast.map((cast) => (
                  <div className="cast-card" key={cast.id}>
                    {cast.profile_path ? (
                      <img
                        src={imageUrl(cast.profile_path, "w185")}
                        alt={cast.name}
                        loading="lazy"
                      />
                    ) : (
                      <div className="cast-avatar-fallback">
                        <FaUser />
                      </div>
                    )}
                    <p className="cast-name">{cast.name}</p>
                    {cast.character && (
                      <p className="cast-character">{cast.character}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="similar-movies-wrapper">
          <h3 className="section-heading">
            <span>You may also like</span>
          </h3>
          <div className="similar-movies">{similar.map(renderSimilar)}</div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetails;
