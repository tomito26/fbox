import { useCallback, useEffect, useRef, useState } from "react";

// How many TMDB pages (20 items each) to pull per batch — initial load and each
// "Load more" press.
export const PAGE_BATCH = 2;

// Drives a paginated card grid shared by the Movies / TV-Series / Browse pages:
// initial load, then a "Load more" that appends and dedupes while tracking
// whether more pages remain.
//
// `fetchPage(startPage, pages)` must resolve to { data, error, totalPages } —
// the getList() and discover() services already return exactly that shape.
// `deps` re-runs the initial load when the query changes (e.g. a new filter).
export function usePagedList(fetchPage, deps) {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Keep the latest fetcher without making it an effect dependency (it usually
  // closes over filter state and would otherwise re-run the load on every keystroke).
  const fetchRef = useRef(fetchPage);
  fetchRef.current = fetchPage;

  // Guard against setState after unmount for the in-flight "Load more".
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    setStatus("loading");
    fetchRef.current(1, PAGE_BATCH).then(({ data, error, totalPages }) => {
      if (!active) return;
      if (error) {
        setStatus("error");
        return;
      }
      setItems(data || []);
      setTotalPages(totalPages || 1);
      setNextPage(1 + PAGE_BATCH);
      setStatus("ready");
    });
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  const loadMore = useCallback(() => {
    setLoadingMore(true);
    fetchRef.current(nextPage, PAGE_BATCH).then(({ data, error }) => {
      if (!alive.current) return;
      setLoadingMore(false);
      if (error || !data) return;
      setItems((cur) => {
        const seen = new Set(cur.map((i) => `${i.media_type || ""}-${i.id}`));
        return [...cur, ...data.filter((i) => !seen.has(`${i.media_type || ""}-${i.id}`))];
      });
      setNextPage((n) => n + PAGE_BATCH);
    });
  }, [nextPage]);

  const hasMore = nextPage <= totalPages;
  return { items, status, loadMore, loadingMore, hasMore };
}
