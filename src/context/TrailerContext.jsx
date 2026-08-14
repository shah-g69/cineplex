import {
  createContext,
  useContext,
  useState,
} from "react";

import { getTrailerUrl } from "../services/api";
import TrailerPlayer from "../components/TrailerPlayer";

const TrailerContext = createContext(null);

export function TrailerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  async function playTrailer(show) {
    setLoading(true);
    setTrailerUrl(null);
    setIsOpen(true);

    const url = await getTrailerUrl(show);

    setLoading(false);

    if (!url) {
      setIsOpen(false);
      return;
    }

    setTrailerUrl(url);
  }

  function closeTrailer() {
    setIsOpen(false);
    setTrailerUrl(null);
  }

  return (
    <TrailerContext.Provider
      value={{ playTrailer, closeTrailer, isOpen }}
    >
      {children}

      {isOpen && (
        <TrailerPlayer
          videoUrl={trailerUrl}
          loading={loading}
          onClose={closeTrailer}
        />
      )}
    </TrailerContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTrailer() {
  return useContext(TrailerContext);
}
