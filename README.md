# fbox

A movie & TV browsing UI built with **Create React App (React 17)**. Data comes
from [TMDB](https://www.themoviedb.org/), and authentication / user data is
handled by **Firebase** (Auth + Firestore).

## Getting started

```bash
npm install
cp .env.example .env   # then fill in your own keys (see below)
npm start              # http://localhost:3000
```

Other scripts: `npm test`, `npm run build`.

## Environment variables

Copy `.env.example` to `.env` and provide your own Firebase and TMDB
credentials. Required keys are listed in `.env.example`.

> ⚠️ **These values are not secret.** Create React App inlines every
> `REACT_APP_*` variable into the client bundle, so anyone using the site can
> read them. Do not rely on hiding them:
> - **TMDB** – restrict and rotate the key from your TMDB account settings.
> - **Firebase** – web API keys are public by design; protect your data with
>   [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/get-started),
>   not by hiding the key.
>
> `.env` was previously committed to this repository. It is now git-ignored, but
> the old keys still exist in git history — **rotate them**.
>
> Note: the previous `.env` had a typo (`REAct_APP_MESSAGING_SENDER_ID`). The
> correct name is `REACT_APP_MESSAGING_SENDER_ID`, as used in
> `src/firebase-config.js`.

## Project structure

```
src/
  services/tmdb.js        # Central TMDB client (fetching, image URLs, errors)
  components/             # Reusable UI (MovieCard, SeriesCard, Navbar, ...)
  pages/                  # Route-level pages (movies, tvSeries, imdb, search, ...)
  Context/                # Auth context (Firebase onAuthStateChanged)
```

Movie and TV cards are rendered by the shared `MovieCard` / `SeriesCard`
components. Data fetching goes through `src/services/tmdb.js` — add new
endpoints there rather than calling `fetch` directly in components.
