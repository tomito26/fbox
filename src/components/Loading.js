const Loading = () => {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading-spinner" />
      <span className="loading-text">Loading…</span>
    </div>
  );
};

export default Loading;
