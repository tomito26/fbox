import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { FaTimes, FaHistory, FaFilm } from "react-icons/fa";
import SearchIcon from "./SearchIcon";
import { searchMulti, imageUrl } from "../services/tmdb";

const RECENT_KEY = "fbox.recentSearches";
const MAX_RECENT = 5;
const MAX_SUGGESTIONS = 7;

const loadRecent = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(RECENT_KEY));
    return Array.isArray(stored) ? stored.slice(0, MAX_RECENT) : [];
  } catch {
    return [];
  }
};

// Debounce so autocomplete fires once per typing pause, not per keystroke.
const useDebouncedValue = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};

// Navbar search: combobox with live TMDB suggestions, recent searches and
// keyboard navigation. Submitting still lands on /search for the full results.
const SearchBox = () => {
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const [recent, setRecent] = useState(loadRecent);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const debouncedTerm = useDebouncedValue(term.trim());

  // Keep the input in sync with the URL on /search so users can refine the
  // query they just ran (footer links included) instead of retyping it.
  useEffect(() => {
    if (pathname === "/search") setTerm(searchParams.get("q") || "");
  }, [pathname, searchParams]);

  // Close the dropdown when the route changes (a suggestion was opened).
  useEffect(() => {
    setOpen(false);
    setHighlight(-1);
  }, [pathname]);

  useEffect(() => {
    const closeOnOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHighlight(-1);
      }
    };
    document.addEventListener("mousedown", closeOnOutside);
    return () => document.removeEventListener("mousedown", closeOnOutside);
  }, []);

  // "/" focuses search from anywhere (ignored while typing in another field).
  useEffect(() => {
    const focusOnSlash = (e) => {
      const el = document.activeElement;
      const typing =
        el &&
        (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "/" && !typing) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    document.addEventListener("keydown", focusOnSlash);
    return () => document.removeEventListener("keydown", focusOnSlash);
  }, []);

  // Drop suggestions the moment the input is cleared/shortened — waiting for
  // the debounce would leave the previous query's results clickable under a
  // brand-new query (e.g. clear "batman", type "stranger things").
  const trimmed = term.trim();
  useEffect(() => {
    if (trimmed.length < 2) setSuggestions([]);
  }, [trimmed]);

  // Fetch suggestions for the debounced query; abort superseded requests.
  useEffect(() => {
    if (debouncedTerm.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    const controller = new AbortController();
    setLoading(true);
    searchMulti(debouncedTerm, 1, controller.signal).then(({ data, error }) => {
      if (controller.signal.aborted) return;
      setLoading(false);
      if (error || !data) {
        // Autocomplete failures shouldn't nag; the full search page still works.
        setSuggestions([]);
        return;
      }
      const media = (data.results || [])
        .filter((item) => item.media_type === "movie" || item.media_type === "tv")
        .slice(0, MAX_SUGGESTIONS);
      setSuggestions(media);
      setHighlight(-1);
    });
    return () => controller.abort();
  }, [debouncedTerm]);

  const saveRecent = (query) => {
    const next = [query, ...recent.filter((q) => q.toLowerCase() !== query.toLowerCase())]
      .slice(0, MAX_RECENT);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // Storage full/blocked — recent searches just won't persist.
    }
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      localStorage.removeItem(RECENT_KEY);
    } catch {}
  };

  const runSearch = (query) => {
    saveRecent(query);
    setOpen(false);
    setHighlight(-1);
    setTerm(query);
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const openSuggestion = (item) => {
    setOpen(false);
    setHighlight(-1);
    navigate(item.media_type === "movie" ? `/movie/${item.id}` : `/tvshows/${item.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = term.trim();
    if (!query) return;
    runSearch(query);
  };

  const showRecent = trimmed.length < 2 && recent.length > 0;
  // Flat option list the keyboard walks through: recents, or suggestions plus
  // a final "see all results" row.
  const options = showRecent
    ? recent.map((q) => ({ kind: "recent", query: q }))
    : [
        ...suggestions.map((item) => ({ kind: "media", item })),
        ...(suggestions.length > 0 ? [{ kind: "all", query: trimmed }] : []),
      ];
  // Only claim "no matches" once the debounced query has caught up with the
  // input — otherwise it flashes while the user is still typing.
  const settled = debouncedTerm === trimmed && !loading;
  const hasPanel =
    open && (options.length > 0 || (trimmed.length >= 2 && (loading || settled)));

  const activateOption = (opt) => {
    if (opt.kind === "media") openSuggestion(opt.item);
    else runSearch(opt.query);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      if (options.length === 0) return;
      e.preventDefault();
      setOpen(true);
      const delta = e.key === "ArrowDown" ? 1 : -1;
      // Cycle through -1 (input itself) .. options.length-1, wrapping both ways.
      setHighlight(
        (cur) => ((cur + 1 + delta + options.length + 1) % (options.length + 1)) - 1
      );
    } else if (e.key === "Enter") {
      if (open && highlight >= 0 && options[highlight]) {
        e.preventDefault();
        activateOption(options[highlight]);
      }
      // else: let the form submit → full results page
    } else if (e.key === "Escape") {
      if (open) {
        setOpen(false);
        setHighlight(-1);
      } else {
        inputRef.current?.blur();
      }
    }
  };

  const suggestionYear = (item) => {
    const date = item.release_date || item.first_air_date || "";
    return date ? date.split("-")[0] : "";
  };

  return (
    <form
      className="search-form"
      onSubmit={handleSubmit}
      role="search"
      ref={containerRef}
    >
      <input
        type="text"
        name="searchItem"
        className="form-control"
        placeholder="Enter your keywords..."
        aria-label="Search movies and TV shows"
        role="combobox"
        aria-expanded={hasPanel}
        aria-controls={hasPanel ? "search-listbox" : undefined}
        aria-activedescendant={highlight >= 0 ? `search-option-${highlight}` : undefined}
        aria-autocomplete="list"
        autoComplete="off"
        ref={inputRef}
        value={term}
        onChange={(e) => {
          setTerm(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="search-btn" aria-label="Search">
        <SearchIcon />
      </button>
      {term && (
        <button
          type="button"
          className="search-clear"
          aria-label="Clear search"
          onClick={() => {
            setTerm("");
            inputRef.current?.focus();
          }}
        >
          <FaTimes />
        </button>
      )}
      {hasPanel && (
        <div className="search-suggestions" id="search-listbox" role="listbox">
          {showRecent && (
            <div className="search-suggestions-header">
              <span>Recent searches</span>
              <button type="button" onClick={clearRecent}>Clear</button>
            </div>
          )}
          {options.map((opt, index) => {
            const active = index === highlight;
            if (opt.kind === "recent") {
              return (
                <div
                  key={`recent-${opt.query}`}
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={active}
                  className={`search-suggestion recent${active ? " active" : ""}`}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => activateOption(opt)}
                >
                  <FaHistory className="suggestion-icon" />
                  <span className="suggestion-title">{opt.query}</span>
                </div>
              );
            }
            if (opt.kind === "all") {
              return (
                <div
                  key="see-all"
                  id={`search-option-${index}`}
                  role="option"
                  aria-selected={active}
                  className={`search-suggestion see-all${active ? " active" : ""}`}
                  onMouseEnter={() => setHighlight(index)}
                  onClick={() => activateOption(opt)}
                >
                  See all results for "{opt.query}"
                </div>
              );
            }
            const { item } = opt;
            const title = item.title || item.name || "";
            const year = suggestionYear(item);
            return (
              <div
                key={`${item.media_type}-${item.id}`}
                id={`search-option-${index}`}
                role="option"
                aria-selected={active}
                className={`search-suggestion${active ? " active" : ""}`}
                onMouseEnter={() => setHighlight(index)}
                onClick={() => activateOption(opt)}
              >
                {item.poster_path ? (
                  <img
                    src={imageUrl(item.poster_path, "w92")}
                    alt=""
                    className="suggestion-poster"
                    loading="lazy"
                  />
                ) : (
                  <span className="suggestion-poster suggestion-poster-fallback">
                    <FaFilm />
                  </span>
                )}
                <span className="suggestion-text">
                  <span className="suggestion-title">{title}</span>
                  <span className="suggestion-meta">
                    {year && <span>{year}</span>}
                    <span className="suggestion-badge">
                      {item.media_type === "movie" ? "Movie" : "TV"}
                    </span>
                  </span>
                </span>
              </div>
            );
          })}
          {!showRecent && loading && options.length === 0 && (
            <div className="search-suggestion muted-row">Searching...</div>
          )}
          {!showRecent && settled && trimmed.length >= 2 && suggestions.length === 0 && (
            <div className="search-suggestion muted-row">
              No matches for "{trimmed}"
            </div>
          )}
        </div>
      )}
    </form>
  );
};

export default SearchBox;
