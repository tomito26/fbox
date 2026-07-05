import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Imdb from "./imdb/Imdb";
import SkeletonGrid from "../components/SkeletonGrid";
import { searchMulti } from "../services/tmdb";

const TABS = [
  { value: "all", label: "All" },
  { value: "movie", label: "Movies" },
  { value: "tv", label: "TV Shows" },
];

// Search results page. Reuses the Imdb card because it already handles both
// movie and TV `media_type` results, which is exactly what search/multi returns.
const SearchResults = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const typeParam = searchParams.get("type");
  const activeTab = typeParam === "movie" || typeParam === "tv" ? typeParam : "all";
  const [results, setResults] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    if (!query) {
      setResults([]);
      setStatus("ready");
      return;
    }
    const controller = new AbortController();
    setStatus("loading");
    setPage(1);
    searchMulti(query, 1, controller.signal).then(({ data, error }) => {
      if (controller.signal.aborted) return;
      if (error) {
        setStatus("error");
        return;
      }
      // Only movies and TV shows can render as cards (skip people).
      const media = (data.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults(media);
      setTotalPages(data.total_pages || 1);
      setStatus("ready");
    });
    return () => controller.abort();
  }, [query]);

  const loadMore = () => {
    const nextPage = page + 1;
    setLoadingMore(true);
    searchMulti(query, nextPage).then(({ data, error }) => {
      if (!alive.current) return;
      setLoadingMore(false);
      if (error || !data) return;
      const media = (data.results || []).filter(
        (item) => item.media_type === "movie" || item.media_type === "tv"
      );
      setResults((cur) => {
        // TMDB pages can repeat items — dedupe so React keys stay unique.
        const seen = new Set(cur.map((item) => `${item.media_type}-${item.id}`));
        return [...cur, ...media.filter((item) => !seen.has(`${item.media_type}-${item.id}`))];
      });
      setPage(nextPage);
    });
  };

  const selectTab = (value) => {
    const next = { q: query };
    if (value !== "all") next.type = value;
    setSearchParams(next, { replace: true });
  };

  const visible =
    activeTab === "all" ? results : results.filter((item) => item.media_type === activeTab);
  const countFor = (value) =>
    value === "all"
      ? results.length
      : results.filter((item) => item.media_type === value).length;

  if (!query) {
    return (
      <div className="movie-page">
        <div className="movie-header">
          <h2>
            <span>Search</span>
            <hr />
          </h2>
        </div>
        <div className="search-empty">
          <p>Type a movie or TV show title in the search bar above to get started.</p>
          <p className="search-empty-hint">Popular searches:</p>
          <div className="search-empty-links">
            {["Avengers", "Breaking Bad", "Batman", "Stranger Things"].map((q) => (
              <Link key={q} to={`/search?q=${encodeURIComponent(q)}`}>{q}</Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Results for "{query}"</span>
          <hr />
        </h2>
      </div>
      {status === "ready" && results.length > 0 && (
        <div className="search-tabs" role="tablist" aria-label="Filter results by type">
          {TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.value}
              className={`search-tab${activeTab === tab.value ? " active" : ""}`}
              onClick={() => selectTab(tab.value)}
            >
              {tab.label} ({countFor(tab.value)})
            </button>
          ))}
        </div>
      )}
      {status === "loading" && <SkeletonGrid count={12} />}
      {status === "error" && (
        <p className="fetch-error">Something went wrong with your search. Please try again.</p>
      )}
      {status === "ready" && results.length === 0 && (
        <div className="search-empty">
          <p>No results found for "{query}".</p>
          <p className="search-empty-hint">
            Check the spelling, try a shorter title, or browse instead:
          </p>
          <div className="search-empty-links">
            <Link to="/movies">Movies</Link>
            <Link to="/tvSeries">TV Series</Link>
            <Link to="/topImdb">Top IMDb</Link>
          </div>
        </div>
      )}
      {status === "ready" && results.length > 0 && visible.length === 0 && (
        <p className="fetch-error">
          No {activeTab === "movie" ? "movies" : "TV shows"} in these results — try another tab.
        </p>
      )}
      <div className="movie-wrapper">
        {visible.map((item) => (
          <Imdb trending={item} key={`${item.media_type}-${item.id}`} />
        ))}
      </div>
      {status === "ready" && page < totalPages && (
        <div className="load-more-wrapper">
          <button
            type="button"
            className="load-more-btn"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
