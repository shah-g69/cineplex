import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";

function TVShows() {
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadShows() {
      try {
        const response = await fetch(
          "https://api.tvmaze.com/shows?page=0"
        );

        const data = await response.json();

        setShows(data);
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

        {!loading && (
          <div className="category-grid">

            {shows.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
              />
            ))}

          </div>
        )}

      </main>
    </>
  );
}

export default TVShows;