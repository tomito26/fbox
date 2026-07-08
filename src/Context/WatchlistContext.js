import { createContext, useContext, useEffect, useState } from "react";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { database } from "../firebase-config";
import { useUserAuth } from "./UserAuthContext";

// Persists each user's watchlist as a `watchlist` array on their users/{uid}
// document. We read/write the whole array (rather than arrayUnion/arrayRemove)
// so removal doesn't depend on fragile deep-equality of stored objects.

const WatchlistContext = createContext({
  watchlist: [],
  isSaved: () => false,
  toggleWatchlist: () => {},
});

// Keep only the fields a card needs, dropping undefined (Firestore rejects it).
const normalize = (item) => {
  const fields = [
    "id",
    "media_type",
    "title",
    "name",
    "poster_path",
    "overview",
    "vote_average",
    "release_date",
    "first_air_date",
  ];
  return fields.reduce((acc, key) => {
    if (item[key] !== undefined) acc[key] = item[key];
    return acc;
  }, {});
};

export const WatchlistProvider = ({ children }) => {
  const { user } = useUserAuth();
  const [watchlist, setWatchlist] = useState([]);

  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      return;
    }
    const ref = doc(database, "users", user.uid);
    const unsub = onSnapshot(ref, (snap) => {
      setWatchlist(snap.data()?.watchlist || []);
    });
    return () => unsub();
  }, [user]);

  const isSaved = (id) => watchlist.some((item) => item.id === id);

  const toggleWatchlist = async (item) => {
    if (!user) return;
    const next = isSaved(item.id)
      ? watchlist.filter((w) => w.id !== item.id)
      : [...watchlist, normalize(item)];
    // merge so we never clobber the user's other fields (username, etc.).
    await setDoc(doc(database, "users", user.uid), { watchlist: next }, { merge: true });
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, isSaved, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => useContext(WatchlistContext);
