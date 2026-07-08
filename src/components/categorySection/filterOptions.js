// Single source of truth for the discover filter bar (Genre / Type / Country /
// Year / Sort). DropdownMenus renders straight from these arrays, and
// buildDiscoverParams turns the selected filter state into a TMDB /discover query.

// Curated genre list shared by the navbar dropdown, the footer and the filter
// bar. `id` is the TMDB *movie* genre id; `tvId` is the closest TMDB *TV* genre
// id (a separate list). Genres without a `tvId` have no clean TV equivalent and
// are hidden when the current media type is TV.
export const NAV_GENRES = [
  { label: "Action", id: 28, tvId: 10759 },      // TV: Action & Adventure
  { label: "Adventure", id: 12, tvId: 10759 },   // TV: Action & Adventure
  { label: "Animation", id: 16, tvId: 16 },
  { label: "Comedy", id: 35, tvId: 35 },
  { label: "Crime", id: 80, tvId: 80 },
  { label: "Documentary", id: 99, tvId: 99 },
  { label: "Drama", id: 18, tvId: 18 },
  { label: "Family", id: 10751, tvId: 10751 },
  { label: "Fantasy", id: 14, tvId: 10765 },     // TV: Sci-Fi & Fantasy
  { label: "Horror", id: 27 },                   // no TV genre
  { label: "Mystery", id: 9648, tvId: 9648 },
  { label: "Romance", id: 10749 },               // no TV genre
  { label: "Sci-Fi", id: 878, tvId: 10765 },     // TV: Sci-Fi & Fantasy
  { label: "Thriller", id: 53 },                 // no TV genre
  { label: "War", id: 10752, tvId: 10768 },      // TV: War & Politics
  { label: "Western", id: 37, tvId: 37 },
];

export const NAV_COUNTRIES = [
  { label: "United States", code: "US" },
  { label: "United Kingdom", code: "GB" },
  { label: "Canada", code: "CA" },
  { label: "France", code: "FR" },
  { label: "Germany", code: "DE" },
  { label: "Italy", code: "IT" },
  { label: "Spain", code: "ES" },
  { label: "Japan", code: "JP" },
  { label: "South Korea", code: "KR" },
  { label: "China", code: "CN" },
  { label: "India", code: "IN" },
  { label: "Brazil", code: "BR" },
  { label: "Mexico", code: "MX" },
  { label: "Australia", code: "AU" },
];

// Aliases the filter bar reads from (same data, intent-revealing names).
export const GENRES = NAV_GENRES;
export const COUNTRIES = NAV_COUNTRIES;

// Year filter (single-select): recent individual years + older decades. A decade
// id like "1990s" is expanded to a date range by yearToDateRange below.
const RECENT_YEARS = Array.from({ length: 17 }, (_, i) => `${2026 - i}`); // 2026..2010
const DECADES = ["2000s", "1990s", "1980s", "1970s", "1960s"];
export const YEARS = [...RECENT_YEARS, ...DECADES].map((id) => ({ id, label: id }));

// Sort options (single-select). Limited to choices that work for both movie and
// TV discover; the exact sort_by string is resolved per media type below.
export const SORTS = [
  { id: "default", label: "Popularity" },
  { id: "rating", label: "Rating" },
  { id: "newest", label: "Newest" },
];

// The empty selection state shared by the filter UI.
export const emptyFilters = {
  type: "movie",     // "movie" | "tv"
  genres: [],        // genre labels (see NAV_GENRES)
  includeAll: false, // AND (all) vs OR (any) when multiple genres are picked
  country: "",       // ISO 3166-1 code, "" = any
  year: "",          // year id (e.g. "2020" or "1990s"), "" = any
  sortBy: "default", // SORTS id
};

const yearToDateRange = (id) => {
  // "2020" -> single year; "1990s" -> decade range.
  if (/^\d{4}$/.test(id)) return { year: id };
  const decade = parseInt(id, 10); // "1990s" -> 1990
  if (Number.isNaN(decade)) return {};
  return { gte: `${decade}-01-01`, lte: `${decade + 9}-12-31` };
};

// Build the { type, params } object passed to tmdb.discover(). Media-aware:
// genres map to TV ids on TV, and the year/sort keys switch to the TV variants.
export const buildDiscoverParams = (filters) => {
  const type = filters.type === "tv" ? "tv" : "movie";
  const params = {};

  // Sort
  if (filters.sortBy === "rating") {
    params.sort_by = "vote_average.desc";
    // Ignore obscure titles with only a handful of votes when sorting by rating.
    params["vote_count.gte"] = 200;
  } else if (filters.sortBy === "newest") {
    params.sort_by = type === "tv" ? "first_air_date.desc" : "primary_release_date.desc";
  } else {
    params.sort_by = "popularity.desc";
  }

  // Genres — map each selected label to the id for the current media type. TV
  // genres with no clean equivalent resolve to undefined and drop out.
  const genreIds = filters.genres
    .map((label) => {
      const g = NAV_GENRES.find((x) => x.label === label);
      return g ? (type === "tv" ? g.tvId : g.id) : null;
    })
    .filter(Boolean);
  if (genreIds.length) {
    // comma = AND (all), pipe = OR (any).
    params.with_genres = genreIds.join(filters.includeAll ? "," : "|");
  }

  // Country
  if (filters.country) params.with_origin_country = filters.country;

  // Year (single)
  if (filters.year) {
    const range = yearToDateRange(filters.year);
    const dateKey = type === "tv" ? "first_air_date" : "primary_release_date";
    if (range.year) {
      params[type === "tv" ? "first_air_date_year" : "primary_release_year"] = range.year;
    } else if (range.gte) {
      params[`${dateKey}.gte`] = range.gte;
      params[`${dateKey}.lte`] = range.lte;
    }
  }

  return { type, params };
};
