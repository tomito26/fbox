// Maps the (static) dropdown menu labels to TMDB `discover` query values, plus a
// helper that turns the selected filter state into a { type, params } request.
// Only options that map cleanly to TMDB are wired; anything unmapped (e.g. the
// "Quality" menu, or genres like Costume/Kungfu that TMDB has no id for) is
// simply ignored so it never breaks a query.

// Checkbox id -> TMDB movie genre id.
export const GENRE_IDS = {
  action: 28,
  adventure: 12,
  animation: 16,
  biography: 36, // closest TMDB match: History
  comedy: 35,
  crime: 80,
  documentary: 99,
  drama: 18,
  family: 10751,
  fantasy: 14,
  history: 36,
  horror: 27,
  music: 10402,
  mystery: 9648,
  romance: 10749,
  "sci-fi": 878,
  thriller: 53,
  war: 10752,
  western: 37,
};

// Checkbox id -> ISO 3166-1 country code.
export const COUNTRY_CODES = {
  argentina: "AR",
  australia: "AU",
  austria: "AT",
  belgium: "BE",
  brazil: "BR",
  canada: "CA",
  china: "CN",
  "czech-republic": "CZ",
  denmark: "DK",
  finland: "FI",
  france: "FR",
  germany: "DE",
  hongkong: "HK",
  hungary: "HU",
  india: "IN",
  ireland: "IE",
  israel: "IL",
  italy: "IT",
  japan: "JP",
  mexico: "MX",
  netherland: "NL",
  "new-zealand": "NZ",
  norway: "NO",
  philippines: "PH",
  poland: "PL",
  romania: "RO",
  russia: "RU",
  "south-africa": "ZA",
  southafrica: "ZA",
  "south-korea": "KR",
  spain: "ES",
  sweden: "SE",
  switzerland: "CH",
  "united-kingdom": "GB",
  "united-states": "US",
};

// Radio id -> TMDB sort_by value.
export const SORT_VALUES = {
  default: "popularity.desc",
  "recently-added": "primary_release_date.desc",
  "most-watched": "popularity.desc",
  name: "original_title.asc",
  imdb: "vote_average.desc",
  "release-date": "primary_release_date.desc",
  "site-rating": "vote_count.desc",
};

// Curated lists for the navbar Genres / Country dropdowns. These are the single
// source for those menus; each links to /browse with the corresponding TMDB value.
export const NAV_GENRES = [
  { label: "Action", id: 28 },
  { label: "Adventure", id: 12 },
  { label: "Animation", id: 16 },
  { label: "Comedy", id: 35 },
  { label: "Crime", id: 80 },
  { label: "Documentary", id: 99 },
  { label: "Drama", id: 18 },
  { label: "Family", id: 10751 },
  { label: "Fantasy", id: 14 },
  { label: "Horror", id: 27 },
  { label: "Mystery", id: 9648 },
  { label: "Romance", id: 10749 },
  { label: "Sci-Fi", id: 878 },
  { label: "Thriller", id: 53 },
  { label: "War", id: 10752 },
  { label: "Western", id: 37 },
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

// The empty selection state shared by the filter UI.
export const emptyFilters = {
  genres: [],       // checkbox ids
  includeAll: false, // AND vs OR for multiple genres
  type: "movie",     // "movie" | "tv"
  years: [],         // checkbox ids (e.g. "2020", "1990s")
  countries: [],     // checkbox ids
  sortBy: "default", // radio id
};

const yearToDateRange = (id) => {
  // "2020" -> single year; "1990s" -> decade range.
  if (/^\d{4}$/.test(id)) return { year: id };
  const decade = parseInt(id, 10); // "1990s" -> 1990, "2000s" -> 2000
  if (Number.isNaN(decade)) return {};
  return { gte: `${decade}-01-01`, lte: `${decade + 9}-12-31` };
};

// Build the { type, params } object passed to tmdb.discover().
export const buildDiscoverParams = (filters) => {
  const type = filters.type === "tv" ? "tv" : "movie";
  const params = { sort_by: SORT_VALUES[filters.sortBy] || SORT_VALUES.default };

  const genreIds = filters.genres.map((id) => GENRE_IDS[id]).filter(Boolean);
  if (genreIds.length) {
    // comma = AND (all), pipe = OR (any).
    params.with_genres = genreIds.join(filters.includeAll ? "," : "|");
  }

  const countryCodes = filters.countries.map((id) => COUNTRY_CODES[id]).filter(Boolean);
  if (countryCodes.length) {
    params.with_origin_country = countryCodes.join("|");
  }

  // Only a single year/range can be applied; use the first selection.
  const firstYear = filters.years[0];
  if (firstYear) {
    const range = yearToDateRange(firstYear);
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
