import { useEffect, useState } from "react";
import { FaListUl } from "react-icons/fa";
import { Outlet, useParams } from "react-router-dom";
import {
  getTvShow,
  getTvCredits,
  getTvVideos,
  getSimilarTvShows,
  getTvKeywords,
  pickTrailer,
} from "../services/tmdb";
import MediaDetails from "./MediaDetails";
import SeasonMenu from "./SeasonMenu";
import SimilarTvShow from "./SimilarTvShow";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Format a "MMM DD,YYYY" label from an air_date string, or "" when the date is
// missing/unparseable (guards against `new Date("")` -> Invalid Date/NaN).
const formatAirDate = (airDate) => {
  if (!airDate) return "";
  const d = new Date(airDate);
  if (Number.isNaN(d.getTime())) return "";
  return `${months[d.getMonth()]} ${d.getDate()},${d.getFullYear()}`;
};

const TvShowVideos = () => {
  const { tvshowId } = useParams();
  const [state, setState] = useState({ loading: true, error: null });
  const [isClicked, setIsClicked] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState({
    seasonNumber: "",
    monthReleased: "",
    dateReleased: "",
    yearReleased: "",
  });

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

  const seasons = state.details?.seasons || [];
  const seasonLabel =
    selectedSeason.seasonNumber === ""
      ? "Season 1"
      : `Season ${selectedSeason.seasonNumber}`;
  const seasonDate =
    selectedSeason.seasonNumber === ""
      ? formatAirDate(seasons[0]?.air_date)
      : `${selectedSeason.monthReleased} ${selectedSeason.dateReleased},${selectedSeason.yearReleased}`;

  const extras = (
    <div className="video-links">
      <div className="season-menu">
        <p onClick={() => setIsClicked(true)} className={isClicked ? "isActive" : ""}>
          <FaListUl className="burger" />
          <span className="season-item">{seasonLabel} -</span>
          <span className="season-date">{seasonDate}</span>
        </p>
        {isClicked && (
          <div className="seasonDropdownMenu">
            {seasons.map((season, index) => (
              <SeasonMenu
                key={season.id}
                index={index}
                season={season}
                setIsClicked={setIsClicked}
                setSelectedSeason={setSelectedSeason}
                tvshowId={tvshowId}
              />
            ))}
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );

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
      extras={extras}
      renderSimilar={(similarTvShow) => (
        <SimilarTvShow key={similarTvShow.id} similarTvShow={similarTvShow} />
      )}
    />
  );
};

export default TvShowVideos;
