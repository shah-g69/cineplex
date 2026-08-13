import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function searchShows() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const response = await fetch(
          `https://api.tvmaze.com/search/shows?q=${encodeURIComponent(
            query
          )}`
        );

        const data = await response.json();

        const shows = data.map(
          (item) => item.show
        );

        setResults(shows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    searchShows();
  }, [query]);

  return (
    <>
      <Navbar />

      <main className="search-page">

        <h1>
          Search results for "{query}"
        </h1>

        {loading && (
          <div className="loading">
            Searching...
          </div>
        )}

        {!loading && results.length === 0 && (
          <p className="no-results">
            No shows found.
          </p>
        )}

        {!loading && results.length > 0 && (
          <div className="search-grid">

            {results.map((show) => (
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

export default Search;