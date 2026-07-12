# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

`fbox` is a movie & TV browsing/streaming UI built with **Create React App (React 17)**.
Catalogue data comes from **TMDB**; auth + per-user data (watchlists) from **Firebase**
(Auth + Firestore); actual video playback is embedded from the third-party **Vidking** player.

## Commands

```bash
npm install
cp .env.example .env      # then fill in Firebase + TMDB keys
npm start                 # dev server at http://localhost:3000
npm test                  # Jest + React Testing Library (watch mode)
npm test -- --watchAll=false App.test.js   # run a single test file, no watch
npm run build             # production build (CI=false, so lint warnings don't fail it)
```

Node version is pinned to **24** (`.nvmrc`, `engines.node`). There is no separate
lint script — ESLint runs through `react-scripts` (`react-app` config) during
`start`/`build`/`test`.

## Environment variables

All config is via `REACT_APP_*` vars in `.env` (see `.env.example`). CRA inlines these
into the client bundle at build time, so **none of them are secret** — they are visible
to any site visitor. Firebase web keys are public by design; TMDB keys should be
restricted/rotated at the provider. Protect user data with **Firestore Security Rules**,
not by hiding keys. Note the storage rules live in `storage.rules`.

## Architecture

**Data flow: components never call `fetch` directly.** All TMDB access goes through the
single client in `src/services/tmdb.js`. Add new endpoints there.
- `request()` always resolves to `{ data, error }` and never throws (AbortErrors
  collapse to `{ data: null, error: null }`), so callers render an error state instead
  of crashing.
- `getList()` fetches multiple pages in parallel, concatenates + **dedupes** results
  (by `media_type-id`), and returns `{ data, error, totalPages }`. `discover()` wraps it
  for `/discover/movie|tv` with filter params.
- Detail getters (`getMovie`, `getTvShow`, …) take an optional `AbortSignal` so
  components can cancel in-flight requests on unmount / id change.
- Helpers `imageUrl()`, `pickTrailer()`, `pickCertification()` centralize image URL
  building and TMDB data extraction.

**Pagination.** Grid pages (Movies, TV Series, Browse) share the `usePagedList(fetchPage, deps)`
hook (`src/hooks/usePagedList.js`). `fetchPage(startPage, pages)` must return the
`{ data, error, totalPages }` shape that `getList`/`discover` already produce. The hook
handles initial load, "Load more" append+dedupe, and `hasMore`. `deps` re-runs the
initial load when filters change. `PAGE_BATCH` (2) = TMDB pages pulled per batch.

**Routing** is all in `src/App.js`. Most routes are public (the whole catalogue is
browsable without an account). Only `/watchlist` and `/profile` are auth-gated, wrapped in
`<PrivateLink>`. Detail pages are `/movie/:movieId` and `/tvshows/:tvshowId`.

**Auth & context providers** (nesting matters, set in `App.js`):
- `UserAuthContextProvider` (outermost) subscribes to Firebase `onAuthStateChanged`,
  renders `<Loading/>` until the first auth state resolves, exposes `useUserAuth()`.
- `WatchlistProvider` lives **inside** the Router (it needs `useNavigate` to redirect
  guests to `/login` when they try to save). It mirrors `users/{uid}.watchlist` via a
  Firestore `onSnapshot`. Writes replace the whole array with `setDoc(..., { merge: true })`
  (never `arrayUnion`/`arrayRemove`) and `normalize()` an item down to card fields,
  dropping `undefined` (Firestore rejects it). Use `useWatchlist()`.

**Streaming & watch progress.** `StreamPlayer` embeds the Vidking iframe
(`/embed/movie/{id}` or `/embed/tv/{id}/{season}/{episode}`). The iframe posts
`PLAYER_EVENT` messages (origin-checked to vidking.net); the player throttles `timeupdate`
writes to localStorage. All progress read/write goes through `src/utils/watchProgress.js`
so detail pages can surface resume time / progress bars / watched episodes from the exact
keys the player writes. Keys: `vidking_progress_movie_{id}` and
`vidking_progress_tv_{id}_s{season}e{episode}` (TV progress is per-episode). "Watched" =
`ended` event or ≥90% progress.

## Conventions

- Shared cards: movies render through `MovieCard`, TV through `SeriesCard` — reuse these
  rather than building new card markup.
- `pages/` are route-level screens; `components/` are reusable UI. `components/categorySection/`
  holds the filter dropdowns/options for discover pages.
- Styling is a single global `src/App.css` plus Bootstrap / react-bootstrap.
