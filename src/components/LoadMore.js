// Shared "Load more" control for paginated card grids (Movies / TV-Series /
// Browse / Search). Render only when there are more pages to fetch.
const LoadMore = ({ onClick, loading }) => (
  <div className="load-more-wrapper">
    <button
      type="button"
      className="load-more-btn"
      onClick={onClick}
      disabled={loading}
    >
      {loading ? "Loading..." : "Load More"}
    </button>
  </div>
);

export default LoadMore;
