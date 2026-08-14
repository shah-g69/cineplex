import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowCard from "../components/Showcard";
import FilterBar from "../components/FilterBar";
import { useFilters } from "../hooks/useFilters";
import { getTVShows } from "../services/api";

function TVShows() {
  const [shows, setShows] = useState([]);
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
  } = useFilters(shows);

  useEffect(() => {
    async function loadShows() {
      try {
        const data = await getTVShows();

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
            Loading TV shows...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="no-results">
            {shows.length === 0
              ? "No TV shows found."
              : "No shows match your filters."}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="category-grid">

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

export default TVShows;