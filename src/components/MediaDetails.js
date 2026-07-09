import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaExclamationCircle,
  FaHeart,
  FaPlay,
  FaRegHeart,
  FaShareAlt,
  FaStar,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { imageUrl, getTvSeason, pickCertification } from "../services/tmdb";
import { useWatchlist } from "../Context/WatchlistContext";
import { shareNative } from "../utils/share";
import {
  readResume,
  readProgress,
  watchedFraction,
  formatTime,
} from "../utils/watchProgress";
import StreamPlayer from "./StreamPlayer";
import EpisodeList from "./EpisodeList";

// Shared presentational shell for the movie and TV detail pages. Movie.js and
// TvShowVideos.js fetch + normalize their data, then hand it to this component
// so the ~90% identical markup (and its bugs) lives in exactly one place.
//
// Layout follows streaming-platform convention: the player is the hero at the
// very top (land -> one click -> playing), with resume/watched state surfaced
// from the progress StreamPlayer persists. The poster + synopsis + cast become
// an "About" block below, and the trailer opens in a lightweight modal.

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
}) => {
  const [expanded, setExpanded] = useState(false);
  // Trailer plays in a modal; the heavy YouTube iframe only mounts while open.
  const [showTrailer, setShowTrailer] = useState(false);
  // Facade for the full-stream (Vidking) player — only mounts on Watch/Resume.
  const [watching, setWatching] = useState(false);
  // Selected season + episode for the TV player (movies ignore these).
  const [streamSeason, setStreamSeason] = useState(1);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  // Per-season episode data (stills/titles/overviews) for the rich episode list.
  const [seasonEpisodes, setSeasonEpisodes] = useState({ loading: false, list: [] });
  const { isSaved, toggleWatchlist } = useWatchlist();
  const streamRef = useRef(null);

  // On a new title: collapse the player and seed the season (first real season,
  // skipping "Specials" / season 0 when possible), back to episode 1.
  useEffect(() => {
    setWatching(false);
    setShowTrailer(false);
    const seasons = details.seasons || [];
    const first = seasons.find((s) => s.season_number >= 1) || seasons[0];
    setStreamSeason(first ? first.season_number : 1);
    setCurrentEpisode(1);
    // details.seasons arrives in the same fetch as details.id, so keying on id
    // is sufficient (and avoids re-seeding when unrelated fields change).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details.id]);

  // Fetch the selected season's episodes (TV only) for the rich episode list.
  useEffect(() => {
    if (mediaType !== "tv" || !details.id) return;
    let cancelled = false;
    setSeasonEpisodes({ loading: true, list: [] });
    getTvSeason(details.id, streamSeason).then((res) => {
      if (cancelled) return;
      setSeasonEpisodes({ loading: false, list: res.data?.episodes || [] });
    });
    return () => {
      cancelled = true;
    };
  }, [mediaType, details.id, streamSeason]);

  // Close the trailer modal on Escape and lock body scroll while it's open.
  useEffect(() => {
    if (!showTrailer) return;
    const onKey = (e) => e.key === "Escape" && setShowTrailer(false);
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [showTrailer]);

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
  const certification = pickCertification(details, mediaType);

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

  // Season list for the dropdown, and episode count for the current season as a
  // fallback when detailed episode data hasn't loaded.
  const tvSeasons = isMovie ? [] : details.seasons || [];
  const seasonEpisodeCount =
    tvSeasons.find((s) => s.season_number === streamSeason)?.episode_count || 0;

  // Resume state for the current selection (movie, or current TV episode), read
  // from the same localStorage records StreamPlayer writes.
  const savedProgress = details.id
    ? readProgress(mediaType, details.id, streamSeason, currentEpisode)
    : null;
  const resumeSeconds = savedProgress?.currentTime
    ? Math.floor(savedProgress.currentTime)
    : readResume(mediaType, details.id, streamSeason, currentEpisode);
  const resumeFraction = watchedFraction(savedProgress);
  const primaryLabel = resumeSeconds
    ? `Resume ${formatTime(resumeSeconds)}`
    : "Watch Now";

  // Label the currently-selected TV episode for the player header.
  const currentEpTitle = seasonEpisodes.list.find(
    (ep) => ep.episode_number === currentEpisode
  )?.name;

  // Switching season resets to episode 1; the episode list re-renders below.
  const changeSeason = (num) => {
    setStreamSeason(num);
    setCurrentEpisode(1);
  };

  // Jump straight to a specific episode: switch the player and start it.
  const playEpisode = (ep) => {
    setCurrentEpisode(ep);
    setWatching(true);
    streamRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Watch/Resume reveals + scrolls to the full-stream (Vidking) player.
  const handleWatch = () => {
    setWatching(true);
    streamRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
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

  // Shared meta badges (cert / HD / rating / year / runtime), used in the player
  // header and the About hero.
  const metaBadges = (
    <>
      <span className="meta-badge">HD</span>
      {certification && <span className="meta-cert">{certification}</span>}
      {rating && (
        <span className="meta-rating">
          <FaStar className="star-icon" /> {rating}
        </span>
      )}
      {year && <span>{year}</span>}
      {runtimeText && <span>{runtimeText}</span>}
    </>
  );

  return (
    <div className="movie-video-container">
      {/* ---- Player as hero: first thing on the page --------------------- */}
      {details.id && (
        <section className="stream-hero" ref={streamRef}>
          <div className="stream-topbar">
            <div className="stream-topbar-title">
              <h1>{title}</h1>
              {!isMovie && (
                <span className="stream-now-playing">
                  S{streamSeason} · E{currentEpisode}
                  {currentEpTitle ? ` · ${currentEpTitle}` : ""}
                </span>
              )}
            </div>
            <div className="detail-meta stream-topbar-meta">{metaBadges}</div>
          </div>

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
                  episode={currentEpisode}
                  title={title}
                />
              ) : (
                <button
                  className="trailer-facade"
                  onClick={handleWatch}
                  aria-label={`${primaryLabel} — ${title || "now"}`}
                  style={
                    details.backdrop_path
                      ? {
                          backgroundImage: `url(${imageUrl(details.backdrop_path, "w1280")})`,
                        }
                      : undefined
                  }
                >
                  <span className="trailer-play-btn">
                    <FaPlay />
                  </span>
                  <span className="trailer-label">{primaryLabel}</span>
                  {resumeFraction > 0 && (
                    <span className="facade-progress">
                      <span style={{ width: `${Math.round(resumeFraction * 100)}%` }} />
                    </span>
                  )}
                </button>
              )}
            </div>
          </div>

          <div className="stream-underbar">
            <p className="stream-source-note">
              Plays via an external source (Vidking). If a link is down, try another
              server from the player.
            </p>
            <div className="stream-quick-actions">
              {video && (
                <button
                  className="detail-trailer-btn"
                  onClick={() => setShowTrailer(true)}
                >
                  <FaPlay /> Trailer
                </button>
              )}
              <button
                className={`detail-heart${saved ? " saved" : ""}`}
                aria-label={saved ? "Remove from watchlist" : "Add to watchlist"}
                aria-pressed={saved}
                onClick={() => toggleWatchlist({ ...details, media_type: mediaType })}
              >
                {saved ? <FaHeart /> : <FaRegHeart />}
                <span>{saved ? "In your list" : "Add to list"}</span>
              </button>
              <button
                className="detail-share-btn"
                onClick={handleShare}
                aria-label="Share"
              >
                <FaShareAlt /> <span>Share</span>
              </button>
            </div>
          </div>

          {/* TV only: season dropdown + rich episode list. */}
          {tvSeasons.length > 0 && (
            <div className="stream-controls">
              <div className="season-select">
                <label htmlFor="season-select">Season</label>
                <select
                  id="season-select"
                  value={streamSeason}
                  onChange={(e) => changeSeason(Number(e.target.value))}
                >
                  {tvSeasons.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.name || `Season ${s.season_number}`}
                      {s.episode_count ? ` (${s.episode_count})` : ""}
                    </option>
                  ))}
                </select>
              </div>

              <EpisodeList
                tvId={details.id}
                seasonNumber={streamSeason}
                episodes={seasonEpisodes.list}
                loading={seasonEpisodes.loading}
                episodeCount={seasonEpisodeCount}
                currentEpisode={currentEpisode}
                watchingActive={watching}
                onPlay={playEpisode}
              />
            </div>
          )}
        </section>
      )}

      {/* ---- About: poster + synopsis + primary actions ----------------- */}
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
            <h2 className="detail-title">{title}</h2>
            <div className="detail-meta">{metaBadges}</div>
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
                  <FaPlay /> {primaryLabel}
                </button>
              )}
              {video && (
                <button
                  className="detail-trailer-btn"
                  onClick={() => setShowTrailer(true)}
                >
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
            </div>
          </div>
        </div>
      </section>

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

      {/* ---- Trailer modal --------------------------------------------- */}
      {video && showTrailer && (
        <div
          className="trailer-modal"
          role="dialog"
          aria-modal="true"
          aria-label={`${title || "Title"} trailer`}
          onClick={() => setShowTrailer(false)}
        >
          <div className="trailer-modal-inner" onClick={(e) => e.stopPropagation()}>
            <button
              className="trailer-modal-close"
              onClick={() => setShowTrailer(false)}
              aria-label="Close trailer"
            >
              <FaTimes />
            </button>
            <div className="trailer-modal-frame">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${video.key}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={`${title || "Title"} trailer`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaDetails;
