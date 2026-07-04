import { useState, useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import SeriesCard from "../../components/SeriesCard";
import Loading from "../../components/Loading";
import { getList } from "../../services/tmdb";

const TvSeries = () => {
  const [tvShows, setTvShows] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

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

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Tv Series</span>
          <hr />
        </h2>
        <DropdownMenus />
      </div>
      {status === "loading" && <Loading />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load TV series. Please try again later.</p>
      )}
      <div className="movie-wrapper">
        {tvShows.map((tvShow) => (
          <SeriesCard tvShow={tvShow} key={tvShow.id} />
        ))}
      </div>
    </div>
  );
};

export default TvSeries;
