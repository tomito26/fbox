// Shared read/write for the Vidking watch-progress that StreamPlayer persists to
// localStorage. Kept in one place so the detail page can surface "Continue
// watching" state (resume time, progress bars, watched episodes) using the exact
// same keys the player writes.

// Progress is keyed per-episode for TV so each episode resumes independently.
export const storageKey = (mediaType, id, season, episode) =>
  mediaType === "tv"
    ? `vidking_progress_tv_${id}_s${season}e${episode}`
    : `vidking_progress_movie_${id}`;

// Full saved record ({ currentTime, duration, progress, event, ... }) or null.
export const readProgress = (mediaType, id, season, episode) => {
  try {
    return JSON.parse(
      localStorage.getItem(storageKey(mediaType, id, season, episode)) || "null"
    );
  } catch {
    return null;
  }
};

// Resume position in whole seconds (0 when nothing is saved).
export const readResume = (mediaType, id, season, episode) => {
  const saved = readProgress(mediaType, id, season, episode);
  return saved?.currentTime ? Math.floor(saved.currentTime) : 0;
};

// A title counts as "watched" once the viewer passes 90% (or the player fired
// its `ended` event). Used to check off episodes in the list.
export const isWatched = (saved) =>
  !!saved && (saved.event === "ended" || (saved.progress || 0) >= 90);

// Fraction 0..1 of how far through a title the viewer is, for progress bars.
export const watchedFraction = (saved) => {
  if (!saved) return 0;
  if (saved.progress != null) return Math.min(Math.max(saved.progress / 100, 0), 1);
  if (saved.currentTime && saved.duration)
    return Math.min(saved.currentTime / saved.duration, 1);
  return 0;
};

// Aggregate counts across everything the player has saved to localStorage.
// Movies are one entry each; TV is per-episode (matching how progress is keyed),
// so these are counts of titles/episodes, not distinct shows.
export const watchStats = () => {
  let watched = 0;
  let inProgress = 0;
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key?.startsWith("vidking_progress_")) continue;
      let saved;
      try {
        saved = JSON.parse(localStorage.getItem(key));
      } catch {
        continue;
      }
      if (!saved) continue;
      if (isWatched(saved)) watched++;
      else if (watchedFraction(saved) > 0.02) inProgress++;
    }
  } catch {
    // localStorage unavailable (e.g. privacy mode) — fall back to zeroes.
  }
  return { watched, inProgress };
};

// Seconds -> "M:SS" or "H:MM:SS".
export const formatTime = (totalSeconds) => {
  const s = Math.max(0, Math.floor(totalSeconds || 0));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  const pad = (n) => String(n).padStart(2, "0");
  return h > 0 ? `${h}:${pad(m)}:${pad(sec)}` : `${m}:${pad(sec)}`;
};
