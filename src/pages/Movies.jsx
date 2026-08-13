import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch(
          "https://api.tvmaze.com/shows?page=0"
        );

        const data = await response.json();

        const movieShows = data.filter(
          (show) =>
            show.genres?.includes("Drama") ||
            show.genres?.includes("Action") ||
            show.genres?.includes("Thriller") ||
            show.genres?.includes("Adventure")
        );

        setMovies(movieShows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadMovies();
  }, []);

  return (
    <>
      <Navbar />

      <main className="category-page">

        <h1>Movies</h1>

        {loading && (
          <div className="loading">
            Loading movies...
          </div>
        )}

        {!loading && (
          <div className="category-grid">

            {movies.map((movie) => (
              <ShowCard
                key={movie.id}
                show={movie}
              />
            ))}

          </div>
        )}

      </main>
    </>
  );
}

export default Movies;