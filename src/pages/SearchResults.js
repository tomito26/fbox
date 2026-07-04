import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Imdb from "./imdb/Imdb";
import Loading from "../components/Loading";
import { searchMulti } from "../services/tmdb";

// Search results page. Reuses the Imdb card because it already handles both
// movie and TV `media_type` results, which is exactly what search/multi returns.
const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("ready");
      return;
    }
    let active = true;
    setStatus("loading");
    searchMulti(query).then(({ data, error }) => {
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      // Only movies and TV shows can render as cards (skip people).
      const media = (data.results || []).filter(
        (item) =>
          (item.media_type === "movie" || item.media_type === "tv") &&
          item.poster_path
      );
      setResults(media);
      setStatus("ready");
    });
    return () => {
      active = false;
    };
  }, [query]);

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Results for "{query}"</span>
          <hr />
        </h2>
      </div>
      {status === "loading" && <Loading />}
      {status === "error" && (
        <p className="fetch-error">Something went wrong with your search. Please try again.</p>
      )}
      {status === "ready" && results.length === 0 && (
        <p className="fetch-error">No results found for "{query}".</p>
      )}
      <div className="movie-wrapper">
        {results.map((item) => (
          <Imdb trending={item} key={`${item.media_type}-${item.id}`} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
