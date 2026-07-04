import { useState, useEffect } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import MovieCard from "../../components/MovieCard";
import Loading from "../../components/Loading";
import { getList } from "../../services/tmdb";

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

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

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Movies</span>
          <hr />
        </h2>
        <DropdownMenus />
      </div>
      {status === "loading" && <Loading />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load movies. Please try again later.</p>
      )}
      <div className="movie-wrapper">
        {movies.map((movie) => (
          <MovieCard movie={movie} key={movie.id} />
        ))}
      </div>
    </div>
  );
};

export default Movies;
