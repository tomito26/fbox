import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTvSeason } from "../services/tmdb";

const SeasonOne = () => {
  const [seasonDetails, setSeasonDetails] = useState({});
  const { tvshowId } = useParams();

  useEffect(() => {
    let active = true;
    getTvSeason(tvshowId, 1).then(({ data }) => {
      if (active && data) setSeasonDetails(data);
    });
    return () => {
      active = false;
    };
  }, [tvshowId]);

  return <>{seasonDetails.name || "Season 1"}</>;
};

export default SeasonOne;
