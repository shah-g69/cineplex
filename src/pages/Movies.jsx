import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowRow from "../components/ShowRow";
import {
  getMoviesByGenre,
  MOVIE_GENRES,
} from "../services/api";

function Movies() {
  const [genreRows, setGenreRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMovies() {
      try {
        const rows = await Promise.all(
          MOVIE_GENRES.map(async (genre) => ({
            genre: genre.name,
            shows: await getMoviesByGenre(genre.id),
          }))
        );

        setGenreRows(rows);
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

        {!loading && genreRows.length === 0 && (
          <p className="no-results">
            No movies found.
          </p>
        )}

        {!loading &&
          genreRows.map(
            (row) =>
              row.shows.length > 0 && (
                <section
                  className="genre-section"
                  key={row.genre}
                >
                  <h1>{row.genre}</h1>

                  <ShowRow shows={row.shows} />
                </section>
              )
          )}

      </main>
    </>
  );
}

export default Movies;
