import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import MovieCard from "../components/MovieCard";
import SeriesCard from "../components/SeriesCard";
import SkeletonGrid from "../components/SkeletonGrid";
import { discover } from "../services/tmdb";

// Genre/country landing page reached from the navbar dropdowns. Reuses the shared
// discover() service and card grid — no new fetching logic.
const Browse = () => {
  const [searchParams] = useSearchParams();
  const media = searchParams.get("media") === "tv" ? "tv" : "movie";
  const genre = searchParams.get("genre");
  const country = searchParams.get("country");
  const title = searchParams.get("title") || "Browse";

  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    let active = true;
    setStatus("loading");
    const params = {};
    if (genre) params.with_genres = genre;
    if (country) params.with_origin_country = country;
    discover(media, params).then(({ data, error }) => {
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
  }, [media, genre, country]);

  const renderCard = (item) =>
    media === "tv" ? (
      <SeriesCard tvShow={item} key={item.id} />
    ) : (
      <MovieCard movie={item} key={item.id} />
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
        <p className="fetch-error">Couldn't load titles. Please try again later.</p>
      )}
      {status === "ready" && items.length === 0 && (
        <p className="fetch-error">No titles found for "{title}".</p>
      )}
      {status === "ready" && (
        <div className="movie-wrapper">{items.map(renderCard)}</div>
      )}
    </div>
  );
};

export default Browse;
