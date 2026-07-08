import { useEffect, useRef } from "react";

// Full-stream player via the Vidking embed (https://www.vidking.net).
//   movie: /embed/movie/{tmdbId}
//   tv:    /embed/tv/{tmdbId}/{season}/{episode}
// The player posts { type: "PLAYER_EVENT", data: {...} } messages; we persist
// the watch position to localStorage and resume via ?progress= on return.

const VIDKING = "https://www.vidking.net/embed";
const ACCENT = "FFC300"; // site accent, hex without '#'

const storageKey = (mediaType, id) => `vidking_progress_${mediaType}_${id}`;

const readResume = (mediaType, id) => {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey(mediaType, id)) || "null");
    return saved?.currentTime ? Math.floor(saved.currentTime) : 0;
  } catch {
    return 0;
  }
};

const StreamPlayer = ({ mediaType, id, season = 1, episode = 1, title }) => {
  // Throttle the continuous `timeupdate` writes so we don't hammer localStorage.
  const lastSave = useRef(0);

  const resume = readResume(mediaType, id);
  const params = new URLSearchParams({ color: ACCENT, autoPlay: "true" });
  if (mediaType === "tv") {
    params.set("nextEpisode", "true");
    params.set("episodeSelector", "true");
  }
  if (resume) params.set("progress", String(resume));

  const src =
    mediaType === "tv"
      ? `${VIDKING}/tv/${id}/${season}/${episode}?${params}`
      : `${VIDKING}/movie/${id}?${params}`;

  useEffect(() => {
    const onMessage = (event) => {
      // Only trust messages from the Vidking iframe.
      if (typeof event.origin === "string" && !event.origin.includes("vidking.net")) return;
      const msg = event.data;
      if (!msg || msg.type !== "PLAYER_EVENT" || !msg.data) return;
      const d = msg.data;
      // Always record discrete events (play/pause/ended/seeked); throttle timeupdate.
      if (d.event === "timeupdate" && Date.now() - lastSave.current < 5000) return;
      lastSave.current = Date.now();
      try {
        localStorage.setItem(
          storageKey(mediaType, id),
          JSON.stringify({
            id,
            mediaType,
            currentTime: d.currentTime,
            duration: d.duration,
            progress: d.progress,
            season: d.season,
            episode: d.episode,
            event: d.event,
            updatedAt: Date.now(),
          })
        );
      } catch {
        // storage full/blocked — progress just won't persist
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [mediaType, id]);

  return (
    <iframe
      src={src}
      title={`${title || "Title"} player`}
      frameBorder="0"
      allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
    />
  );
};

export default StreamPlayer;
