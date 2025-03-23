import React, { createContext, useState } from "react";

const WatchlistContext = createContext();

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState([]);

  const toggleWatchlist = (anime) => {
    if (watchlist.some((item) => item.id === anime.id)) {
      setWatchlist((prev) => prev.filter((item) => item.id !== anime.id));
    } else {
      setWatchlist((prev) => [...prev, anime]);
    }
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, toggleWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export default WatchlistContext;
