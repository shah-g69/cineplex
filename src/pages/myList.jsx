import { useState } from "react";

import Navbar from "../components/Navbar";
import ShowCard from "../components/Showcard";
import FilterBar from "../components/FilterBar";
import { useFilters } from "../hooks/useFilters";

import {
  getMyList,
  removeFromMyList,
} from "../utils/myList";
import { useNotifications } from "../context/NotificationContext";

function MyList() {
  const [shows, setShows] = useState(() =>
    getMyList()
  );

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

  const { notify } = useNotifications();

  function handleRemove(id) {
    const removed = shows.find(
      (show) => show.id === id
    );

    const updatedList = removeFromMyList(id);

    setShows(updatedList);
    resetFilters();

    if (removed) {
      notify(`${removed.name} removed from My List`);
    }
  }

  return (
    <>
      <Navbar />

      <main className="my-list-page">

        <h1>My List</h1>

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

        {shows.length === 0 && (
          <div className="empty-list">

            <h2>Your list is empty</h2>

            <p>
              Shows you add to My List will
              appear here.
            </p>

          </div>
        )}

        {shows.length > 0 && filtered.length === 0 && (
          <p className="no-results">
            No shows match your filters.
          </p>
        )}

        {shows.length > 0 && filtered.length > 0 && (
          <div className="my-list-grid">

            {filtered.map((show) => (
              <div
                className="my-list-item"
                key={show.id}
              >

                <ShowCard show={show} />

                <button
                  className="remove-button"
                  onClick={() =>
                    handleRemove(show.id)
                  }
                >
                  ✕ Remove
                </button>

              </div>
            ))}

          </div>
        )}

      </main>
    </>
  );
}

export default MyList;