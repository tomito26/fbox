import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getTvShow,
  getTvCredits,
  getTvVideos,
  getSimilarTvShows,
  getTvKeywords,
  pickTrailer,
} from "../services/tmdb";
import MediaDetails from "./MediaDetails";
import SimilarTvShow from "./SimilarTvShow";

// Fetches + normalizes a TV show's data and hands it to the shared MediaDetails
// shell. Season/episode selection now lives inside MediaDetails (under the
// player), so this is a thin wrapper like Movie.js.
const TvShowVideos = () => {
  const { tvshowId } = useParams();
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setState({ loading: true, error: null });

    (async () => {
      const [details, videos, credits, similar, keywords] = await Promise.all([
        getTvShow(tvshowId, signal),
        getTvVideos(tvshowId, signal),
        getTvCredits(tvshowId, signal),
        getSimilarTvShows(tvshowId, signal),
        getTvKeywords(tvshowId, signal),
      ]);

      if (signal.aborted) return;

      if (details.error) {
        setState({ loading: false, error: details.error });
        return;
      }

      setState({
        loading: false,
        error: null,
        details: details.data || {},
        video: pickTrailer(videos.data?.results),
        casts: credits.data?.cast || [],
        directors: (credits.data?.crew || []).filter(
          (member) => member.known_for_department === "Directing"
        ),
        similar: (similar.data?.results || []).slice(0, 9),
        keywords: keywords.data?.results || [],
      });
    })();

    return () => controller.abort();
  }, [tvshowId]);

  return (
    <MediaDetails
      mediaType="tv"
      loading={state.loading}
      error={state.error}
      details={state.details}
      video={state.video}
      casts={state.casts}
      directors={state.directors}
      similar={state.similar}
      keywords={state.keywords}
      renderSimilar={(similarTvShow) => (
        <SimilarTvShow key={similarTvShow.id} similarTvShow={similarTvShow} />
      )}
    />
  );
};

export default TvShowVideos;
