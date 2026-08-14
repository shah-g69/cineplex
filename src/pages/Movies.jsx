import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowCard from "../components/Showcard";
import FilterBar from "../components/FilterBar";
import { useFilters } from "../hooks/useFilters";
import { getMovies } from "../services/api";

function Movies() {
  const [movies, setMovies] = useState([]);
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
  } = useFilters(movies);

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getMovies();

        setMovies(data);
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
            Loading movies...
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <p className="no-results">
            {movies.length === 0
              ? "No movies found."
              : "No shows match your filters."}
          </p>
        )}

        {!loading && filtered.length > 0 && (
          <div className="category-grid">

            {filtered.map((movie) => (
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