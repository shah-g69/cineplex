import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import Navbar from "../components/Navbar";
import ShowCard from "../components/Showcard";
import FilterBar from "../components/FilterBar";
import { useFilters } from "../hooks/useFilters";
import { searchShows } from "../services/api";

function Search() {
  const [searchParams] = useSearchParams();

  const query = searchParams.get("q");

  const [results, setResults] = useState([]);

  const [loading, setLoading] = useState(true);

  const {
    filters,
    options,
    filtered,
    activeCount,
    activeFilters,
    toggleGenre,
    updateFilter,
    removeFilter,
    resetFilters,
  } = useFilters(results);

  useEffect(() => {
    async function runSearch() {
      if (!query) {
        setResults([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const shows = await searchShows(query);

        setResults(shows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    runSearch();
  }, [query]);

  return (
    <>
      <Navbar />

      <main className="search-page">

        <h1>
          Search results for "{query}"
        </h1>

        <FilterBar
          options={options}
          filters={filters}
          activeCount={activeCount}
          activeFilters={activeFilters}
          onToggleGenre={toggleGenre}
          onChange={updateFilter}
          onRemoveFilter={removeFilter}
          onReset={resetFilters}
        />

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

        {!loading && results.length > 0 && filtered.length === 0 && (
          <p className="no-results">
            No shows match your filters.
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="search-grid">

            {filtered.map((show) => (
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