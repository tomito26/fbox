const BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = process.env.REACT_APP_MOVIE_API_KEY;

export async function tmdbFetch(path, params = {}, options = {}) {
    const query = new URLSearchParams({ api_key: API_KEY, ...params });
    const res = await fetch(`${BASE_URL}${path}?${query}`, options);
    if (!res.ok) {
        throw new Error(`TMDB request to ${path} failed with status ${res.status}`);
    }
    return res.json();
}
