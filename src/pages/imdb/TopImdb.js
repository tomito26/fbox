import { useEffect, useState } from "react";
import MovieCard from "../../components/MovieCard";
import SeriesCard from "../../components/SeriesCard";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import SkeletonGrid from "../../components/SkeletonGrid";
import { getList } from "../../services/tmdb";

const TopImdb = () => {
  const [trendings, setTrendings] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    let active = true;
    getList("/trending/all/week", { pages: 4, startPage: 5 }).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      setTrendings(data);
      setStatus("ready");
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Top IMDb</span>
          <hr />
        </h2>
        <DropdownMenus />
      </div>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load titles. Please try again later.</p>
      )}
      {status === "ready" && (
        <div className="movie-wrapper">
          {trendings
            .filter((t) => t.media_type === "movie" || t.media_type === "tv")
            .map((t) =>
              t.media_type === "tv" ? (
                <SeriesCard tvShow={t} key={`tv-${t.id}`} />
              ) : (
                <MovieCard movie={t} key={`movie-${t.id}`} />
              )
            )}
        </div>
      )}
    </div>
  );
};

export default TopImdb;
