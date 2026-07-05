import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getMovie,
  getMovieCredits,
  getMovieVideos,
  getSimilarMovies,
  getMovieKeywords,
  pickTrailer,
} from "../services/tmdb";
import MediaDetails from "./MediaDetails";
import SimilarMovies from "./SimilarMovies";

const Movie = () => {
  const { movieId } = useParams();
  const [state, setState] = useState({ loading: true, error: null });

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setState({ loading: true, error: null });

    (async () => {
      const [details, videos, credits, similar, keywords] = await Promise.all([
        getMovie(movieId, signal),
        getMovieVideos(movieId, signal),
        getMovieCredits(movieId, signal),
        getSimilarMovies(movieId, signal),
        getMovieKeywords(movieId, signal),
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
        keywords: keywords.data?.keywords || [],
      });
    })();

    return () => controller.abort();
  }, [movieId]);

  return (
    <MediaDetails
      mediaType="movie"
      loading={state.loading}
      error={state.error}
      details={state.details}
      video={state.video}
      casts={state.casts}
      directors={state.directors}
      similar={state.similar}
      keywords={state.keywords}
      renderSimilar={(similarMovie) => (
        <SimilarMovies key={similarMovie.id} similarMovie={similarMovie} />
      )}
    />
  );
};

export default Movie;
