import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowRow from "../components/ShowRow";
import {
  getTVShowsByGenre,
  TV_GENRES,
} from "../services/api";

function TVShows() {
  const [genreRows, setGenreRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShows() {
      try {
        const rows = await Promise.all(
          TV_GENRES.map(async (genre) => ({
            genre: genre.name,
            shows: await getTVShowsByGenre(genre.id),
          }))
        );

        setGenreRows(rows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadShows();
  }, []);

  return (
    <>
      <Navbar />

      <main className="category-page">

        <h1>TV Shows</h1>

        {loading && (
          <div className="loading">
            Loading TV shows...
          </div>
        )}

        {!loading && genreRows.length === 0 && (
          <p className="no-results">
            No TV shows found.
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

export default TVShows;
