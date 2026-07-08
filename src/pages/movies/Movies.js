import { useState, useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import MovieCard from "../../components/MovieCard";
import SeriesCard from "../../components/SeriesCard";
import SkeletonGrid from "../../components/SkeletonGrid";
import { getList, discover } from "../../services/tmdb";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  // Once a filter is applied we show discover results instead of the default list.
  const [filtered, setFiltered] = useState(false);
  const [filterType, setFilterType] = useState("movie");

  useEffect(() => {
    let active = true;
    getList("/movie/now_playing", { pages: 4 }).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      setMovies(data);
      setStatus("ready");
    });
    return () => {
      active = false;
    };
  }, []);

  const handleFilter = (type, params) => {
    setStatus("loading");
    setFiltered(true);
    setFilterType(type);
    discover(type, params).then(({ data, error }) => {
      if (error) {
        setStatus("error");
        return;
      }
      setMovies(data);
      setStatus("ready");
    });
  };

  const renderCard = (item) =>
    filtered && filterType === "tv" ? (
      <SeriesCard tvShow={item} key={item.id} />
    ) : (
      <MovieCard movie={item} key={item.id} />
    );

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Movies</span>
          <hr />
        </h2>
        <DropdownMenus onFilter={handleFilter} />
      </div>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load movies. Please try again later.</p>
      )}
      {status === "ready" && movies.length === 0 && (
        <p className="fetch-error">No titles match those filters.</p>
      )}
      {status === "ready" && <div className="movie-wrapper">{movies.map(renderCard)}</div>}
    </div>
  );
};

export default Movies;
