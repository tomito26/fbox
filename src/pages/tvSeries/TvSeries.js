import { useState, useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import SeriesCard from "../../components/SeriesCard";
import MovieCard from "../../components/MovieCard";
import Loading from "../../components/Loading";
import { getList, discover } from "../../services/tmdb";

const TvSeries = () => {
  const [tvShows, setTvShows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [filtered, setFiltered] = useState(false);
  const [filterType, setFilterType] = useState("tv");

  useEffect(() => {
    let active = true;
    getList("/tv/popular", { pages: 4 }).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      setTvShows(data);
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
      setTvShows(data);
      setStatus("ready");
    });
  };

  const renderCard = (item) =>
    filtered && filterType === "movie" ? (
      <MovieCard movie={item} key={item.id} />
    ) : (
      <SeriesCard tvShow={item} key={item.id} />
    );

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Tv Series</span>
          <hr />
        </h2>
        <DropdownMenus onFilter={handleFilter} />
      </div>
      {status === "loading" && <Loading />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load TV series. Please try again later.</p>
      )}
      {status === "ready" && tvShows.length === 0 && (
        <p className="fetch-error">No titles match those filters.</p>
      )}
      <div className="movie-wrapper">{tvShows.map(renderCard)}</div>
    </div>
  );
};

export default TvSeries;
