import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import DropdownMenus from "../components/categorySection/DropdownMenus";
import MovieCard from "../components/MovieCard";
import SeriesCard from "../components/SeriesCard";
import SkeletonGrid from "../components/SkeletonGrid";
import LoadMore from "../components/LoadMore";
import { discover } from "../services/tmdb";
import { usePagedList } from "../hooks/usePagedList";

// Genre/country landing page reached from the navbar dropdowns. The media type
// (movie/tv) and the base genre/country come from the URL; the filter bar can
// refine within that (sort, year, extra country/genre) without leaving the page.
const Browse = () => {
  const [searchParams] = useSearchParams();
  const media = searchParams.get("media") === "tv" ? "tv" : "movie";
  const genre = searchParams.get("genre");
  const country = searchParams.get("country");
  const title = searchParams.get("title") || "Browse";

  // Refinement applied via the filter bar (params only — the media type stays
  // whatever the nav entry point set, so a "Korea TV" page can't flip to movies).
  const [filterParams, setFilterParams] = useState(null);

  const fetchPage = useCallback(
    (startPage, pages) => {
      const baseParams = {};
      if (genre) baseParams.with_genres = genre;
      if (country) baseParams.with_origin_country = country;
      // Filter-bar selections override the URL defaults where they overlap.
      const params = filterParams ? { ...baseParams, ...filterParams } : baseParams;
      return discover(media, params, pages, startPage);
    },
    [media, genre, country, filterParams]
  );

  const { items, status, loadMore, loadingMore, hasMore } = usePagedList(
    fetchPage,
    [media, genre, country, filterParams]
  );

  const renderCard = (item) =>
    media === "tv" ? (
      <SeriesCard tvShow={item} key={item.id} />
    ) : (
      <MovieCard movie={item} key={item.id} />
    );

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>{title}</span>
          <hr />
        </h2>
        <DropdownMenus onFilter={(type, params) => setFilterParams(params)} />
      </div>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load titles. Please try again later.</p>
      )}
      {status === "ready" && items.length === 0 && (
        <p className="fetch-error">No titles found for "{title}".</p>
      )}
      {status === "ready" && items.length > 0 && (
        <>
          <div className="movie-wrapper">{items.map(renderCard)}</div>
          {hasMore && <LoadMore onClick={loadMore} loading={loadingMore} />}
        </>
      )}
    </div>
  );
};

export default Browse;
