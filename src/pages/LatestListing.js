import { useEffect, useState } from "react";
import MovieCard from "../components/MovieCard";
import SeriesCard from "../components/SeriesCard";
import SkeletonGrid from "../components/SkeletonGrid";
import { getList } from "../services/tmdb";

// Dedicated "View all" listing for the homepage rows. Pulls the same TMDB feeds
// the home previews use (now_playing / on_the_air / trending) but across several
// pages for a full grid, reusing the shared cards + loading/error states.
const CONFIG = {
  movies: { title: "Latest Movies", path: "/movie/now_playing" },
  series: { title: "Latest Series", path: "/tv/on_the_air" },
  trending: { title: "Requested", path: "/trending/all/week" },
};

const LatestListing = ({ kind }) => {
  const { title, path } = CONFIG[kind];
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    let active = true;
    setStatus("loading");
    getList(path, { pages: 4 }).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      setItems(data);
      setStatus("ready");
    });
    return () => {
      active = false;
    };
  }, [path]);

  // Trending mixes movies, TV and people — keep only playable media types.
  const cards = items
    .filter((item) =>
      kind === "trending"
        ? item.media_type === "movie" || item.media_type === "tv"
        : true
    )
    .map((item) =>
      kind === "series" || item.media_type === "tv" ? (
        <SeriesCard key={item.id} tvShow={item} />
      ) : (
        <MovieCard key={item.id} movie={item} />
      )
    );

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>{title}</span>
          <hr />
        </h2>
      </div>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && (
        <p className="fetch-error">
          Couldn't load {title.toLowerCase()}. Please try again later.
        </p>
      )}
      {status === "ready" && cards.length === 0 && (
        <p className="fetch-error">Nothing to show right now.</p>
      )}
      {status === "ready" && cards.length > 0 && (
        <div className="movie-wrapper">{cards}</div>
      )}
    </div>
  );
};

export default LatestListing;
