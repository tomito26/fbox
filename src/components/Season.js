import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvSeason } from "../services/tmdb";

const Season = () => {
  const [seasonDetails, setSeasonDetails] = useState({});
  const { tvshowId, seasonNumber } = useParams();

  useEffect(() => {
    let active = true;
    getTvSeason(tvshowId, seasonNumber).then(({ data }) => {
      if (active && data) setSeasonDetails(data);
    });
    return () => {
      active = false;
    };
  }, [tvshowId, seasonNumber]);

  return <>{seasonDetails.name || `Season ${seasonNumber}`}</>;
};

export default Season;
