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

  // Refinement applied via the filter bar ({ type, params }); null until used.
  const [filter, setFilter] = useState(null);

  const fetchPage = useCallback(
    (startPage, pages) => {
      const baseParams = {};
      if (genre) baseParams.with_genres = genre;
      if (country) baseParams.with_origin_country = country;
      // Filter-bar selections override the URL defaults where they overlap.
      const type = filter?.type || media;
      const params = filter ? { ...baseParams, ...filter.params } : baseParams;
      return discover(type, params, pages, startPage);
    },
    [media, genre, country, filter]
  );

  const { items, status, loadMore, loadingMore, hasMore } = usePagedList(
    fetchPage,
    [media, genre, country, filter]
  );

  const activeType = filter?.type || media;
  const renderCard = (item) =>
    activeType === "tv" ? (
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
        <DropdownMenus
          onFilter={(type, params) => setFilter({ type, params })}
          initialType={media}
        />
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
