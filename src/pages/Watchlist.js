import Imdb from "./imdb/Imdb";
import { useWatchlist } from "../Context/WatchlistContext";

// Renders the user's saved items. Uses the Imdb card because it handles both
// movie and TV `media_type` entries, which is what the watchlist stores.
const Watchlist = () => {
  const { watchlist } = useWatchlist();

  return (
    <div className="movie-page">
      <div className="movie-header">
        <h2>
          <span>My Watchlist</span>
          <hr />
        </h2>
      </div>
      {watchlist.length === 0 ? (
        <p className="fetch-error">
          Your watchlist is empty. Tap the heart on any title to save it here.
        </p>
      ) : (
        <div className="movie-wrapper">
          {watchlist.map((item) => (
            <Imdb trending={item} key={`${item.media_type}-${item.id}`} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
