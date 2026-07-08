// Centralized TMDB API client.
// All movie/TV data fetching goes through here so the API key, base URLs and
// error handling live in one place instead of being copy-pasted per component.

const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p";
const KEY = process.env.REACT_APP_MOVIE_API_KEY;

// Build an image URL. `size` is a TMDB size bucket (e.g. w342, w500, original).
// Cards should prefer small sizes; original images are 2-4MB each.
export const imageUrl = (path, size = "w500") =>
  path ? `${IMG}/${size}${path}` : "";

const buildUrl = (path, params = {}) => {
  const query = new URLSearchParams({ api_key: KEY, language: "en-US", ...params });
  return `${BASE}${path}?${query.toString()}`;
};

// Single request. Always resolves to { data, error } — never throws — so callers
// can render an error state instead of crashing on a failed/aborted fetch.
async function request(path, params = {}, options = {}) {
  try {
    const res = await fetch(buildUrl(path, params), options);
    if (!res.ok) throw new Error(`TMDB request failed (${res.status})`);
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    if (error.name === "AbortError") return { data: null, error: null };
    return { data: null, error };
  }
}

// Fetch several pages in parallel and concatenate their `results` arrays.
// Replaces the getXxx/getXxx2/getXxx3/getXxx4 copy-paste pattern.
export async function getList(path, { pages = 1, startPage = 1, params = {} } = {}) {
  const pageNumbers = Array.from({ length: pages }, (_, i) => startPage + i);
  const responses = await Promise.all(
    pageNumbers.map((page) => request(path, { ...params, page }))
  );
  const error = responses.find((r) => r.error)?.error || null;
  const results = responses.flatMap((r) => r.data?.results || []);
  // TMDB pages (and mixed movie/tv trending) can repeat items — dedupe so React
  // keys stay unique and cards aren't dropped/duplicated.
  const seen = new Set();
  const deduped = results.filter((item) => {
    const key = `${item.media_type || ""}-${item.id}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  // Expose the catalogue depth so paginated grids know when to stop offering
  // "Load more" (TMDB caps discover at 500 pages).
  const totalPages = responses.reduce(
    (max, r) => Math.max(max, r.data?.total_pages || 0),
    0
  ) || 1;
  return { data: deduped, error, totalPages };
}

// Detail-page getters accept an optional AbortSignal so a component can cancel
// its in-flight requests when it unmounts or the id changes.
export const getMovie = (id, signal) => request(`/movie/${id}`, {}, { signal });
export const getMovieCredits = (id, signal) =>
  request(`/movie/${id}/credits`, {}, { signal });
export const getMovieVideos = (id, signal) =>
  request(`/movie/${id}/videos`, { append_to_response: "videos" }, { signal });
export const getSimilarMovies = (id, signal) =>
  request(`/movie/${id}/similar`, { page: 1 }, { signal });
export const getMovieKeywords = (id, signal) =>
  request(`/movie/${id}/keywords`, {}, { signal });

export const getTvShow = (id, signal) => request(`/tv/${id}`, {}, { signal });
export const getTvCredits = (id, signal) =>
  request(`/tv/${id}/credits`, {}, { signal });
export const getTvVideos = (id, signal) =>
  request(`/tv/${id}/videos`, { append_to_response: "videos" }, { signal });
export const getSimilarTvShows = (id, signal) =>
  request(`/tv/${id}/similar`, { page: 1 }, { signal });
export const getTvKeywords = (id, signal) =>
  request(`/tv/${id}/keywords`, {}, { signal });
export const getTvSeason = (id, seasonNumber) =>
  request(`/tv/${id}/season/${seasonNumber}`);

// Pick the best trailer from a TMDB /videos results array. Prefers an official
// YouTube trailer, then any YouTube trailer, then any YouTube video. Returns
// undefined when there's nothing playable. Replaces the old loose OR-filter
// that could surface a featurette and picked the last match arbitrarily.
export const pickTrailer = (results = []) => {
  const youtube = results.filter((v) => v.site === "YouTube");
  const trailers = youtube.filter((v) => v.type === "Trailer");
  return (
    trailers.find((v) => v.official) ||
    trailers[0] ||
    youtube[0]
  );
};

// Multi search (movies + TV + people). Accepts a page for "Load More" flows and
// an AbortSignal so the navbar autocomplete can cancel superseded requests.
export const searchMulti = (query, page = 1, signal) =>
  request(`/search/multi`, { query, page }, { signal });

// Discover movies or TV shows with filter params (with_genres, sort_by, etc.).
// `type` is "movie" or "tv".
export const discover = (type, params = {}, pages = 2, startPage = 1) =>
  getList(`/discover/${type}`, { pages, params, startPage });
