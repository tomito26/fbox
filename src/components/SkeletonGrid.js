// Shimmer placeholders shown while a card grid loads — feels more responsive
// than a single centered spinner.
const SkeletonGrid = ({ count = 18 }) => {
  return (
    <div className="movie-wrapper">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-poster shimmer" />
          <div className="skeleton-line shimmer" />
          <div className="skeleton-line short shimmer" />
        </div>
      ))}
    </div>
  );
};

export default SkeletonGrid;
