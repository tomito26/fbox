import { useCallback, useState } from "react";
import DropdownMenus from "../../components/categorySection/DropdownMenus";
import SeriesCard from "../../components/SeriesCard";
import MovieCard from "../../components/MovieCard";
import SkeletonGrid from "../../components/SkeletonGrid";
import LoadMore from "../../components/LoadMore";
import { getList, discover } from "../../services/tmdb";
import { usePagedList } from "../../hooks/usePagedList";

const TvSeries = () => {
  // null = the default "popular TV" list; otherwise a { type, params } discover
  // query built from the filter bar.
  const [filter, setFilter] = useState(null);

  const fetchPage = useCallback(
    (startPage, pages) =>
      filter
        ? discover(filter.type, filter.params, pages, startPage)
        : getList("/tv/popular", { pages, startPage }),
    [filter]
  );

  const { items, status, loadMore, loadingMore, hasMore } = usePagedList(
    fetchPage,
    [filter]
  );

  const isMovie = filter?.type === "movie";
  const renderCard = (item) =>
    isMovie ? (
      <MovieCard movie={item} key={item.id} />
    ) : (
      <SeriesCard tvShow={item} key={item.id} />
    );

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>Tv Series</span>
          <hr />
        </h2>
        <DropdownMenus
          onFilter={(type, params) => setFilter({ type, params })}
          initialType="tv"
        />
      </div>
      {status === "loading" && <SkeletonGrid />}
      {status === "error" && (
        <p className="fetch-error">Couldn't load TV series. Please try again later.</p>
      )}
      {status === "ready" && items.length === 0 && (
        <p className="fetch-error">No titles match those filters.</p>
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

export default TvSeries;
