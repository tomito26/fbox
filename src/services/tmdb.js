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
  return { data: deduped, error };
}

export const getMovie = (id) => request(`/movie/${id}`);
export const getMovieCredits = (id) => request(`/movie/${id}/credits`);
export const getMovieVideos = (id) =>
  request(`/movie/${id}/videos`, { append_to_response: "videos" });
export const getSimilarMovies = (id) => request(`/movie/${id}/similar`, { page: 1 });

export const getTvShow = (id) => request(`/tv/${id}`);
export const getTvCredits = (id) => request(`/tv/${id}/credits`);
export const getTvVideos = (id) =>
  request(`/tv/${id}/videos`, { append_to_response: "videos" });
export const getSimilarTvShows = (id) => request(`/tv/${id}/similar`, { page: 1 });
export const getTvSeason = (id, seasonNumber) =>
  request(`/tv/${id}/season/${seasonNumber}`);

export const searchMulti = (query) => request(`/search/multi`, { query, page: 1 });

// Discover movies or TV shows with filter params (with_genres, sort_by, etc.).
// `type` is "movie" or "tv".
export const discover = (type, params = {}, pages = 2) =>
  getList(`/discover/${type}`, { pages, params });
