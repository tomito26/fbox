import { useEffect, useState } from "react";
import Imdb from "./Imdb";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import Loading from "../../components/Loading";
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
      {status === "loading" && <Loading />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load titles. Please try again later.</p>
      )}
      <div className="movie-wrapper">
        {trendings.map((trending) => (
          <Imdb trending={trending} key={trending.id} />
        ))}
      </div>
    </div>
  );
};

export default TopImdb;
