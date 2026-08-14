import { useEffect, useState } from "react";
import {
  Check,
  ChevronDown,
  Filter,
  RotateCcw,
  X,
} from "lucide-react";

function FilterBar({
  options,
  filters,
  activeCount,
  activeFilters,
  onToggleGenre,
  onChange,
  onRemoveFilter,
  onReset,
}) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  function makeSelect(key, label, values) {
    return (
      <label className="filter-select">
        <select
          value={filters[key] || ""}
          onChange={(event) =>
            onChange(key, event.target.value)
          }
          aria-label={label}
        >
          <option value="">{label}</option>

          {values.map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>

        <ChevronDown
          size={16}
          className="filter-select-icon"
        />
      </label>
    );
  }

  return (
    <>
      {/* Header control bar */}
      <div className="filter-controls">
        <button
          className="filter-toggle"
          onClick={() => setIsOpen(true)}
          aria-label="Open filters"
        >
          <Filter size={15} />
          Filters
          {activeCount > 0 && (
            <span className="filter-count">
              {activeCount}
            </span>
          )}
        </button>

        {activeFilters.length > 0 && (
          <div className="filter-chips-bar">
            {activeFilters.map((chip) => (
              <button
                key={chip.key}
                className="filter-chip"
                onClick={() =>
                  onRemoveFilter(chip.type, chip.value)
                }
              >
                {chip.label}
                <X size={12} />
              </button>
            ))}

            <button
              className="filter-clear-all"
              onClick={onReset}
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="filter-backdrop"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out drawer */}
      <aside
        className={`filter-drawer ${
          isOpen ? "open" : ""
        }`}
        aria-hidden={!isOpen}
      >
        <div className="filter-drawer-header">
          <h3>Filters</h3>

          <button
            className="filter-drawer-close"
            onClick={() => setIsOpen(false)}
            aria-label="Close filters"
          >
            <X size={20} />
          </button>
        </div>

        <div className="filter-drawer-body">
          <div className="filter-group">
            <h4>Genres</h4>

            <div className="filter-genres">
              {options.genres.map((genre) => (
                <label
                  key={genre}
                  className="filter-check"
                >
                  <input
                    type="checkbox"
                    checked={filters.genres.includes(
                      genre
                    )}
                    onChange={() => onToggleGenre(genre)}
                  />

                  <span>{genre}</span>

                  {filters.genres.includes(genre) && (
                    <Check
                      size={14}
                      className="filter-check-icon"
                    />
                  )}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h4>Release Year</h4>
            {makeSelect("year", "All Years", options.years)}
          </div>

          <div className="filter-group">
            <h4>Country</h4>
            {makeSelect(
              "country",
              "All Countries",
              options.countries
            )}
          </div>

          <div className="filter-group">
            <h4>Language</h4>
            {makeSelect(
              "language",
              "All Languages",
              options.languages
            )}
          </div>

          <div className="filter-group">
            <h4>Sort</h4>
            <label className="filter-select">
              <select
                value={filters.sort || "default"}
                onChange={(event) =>
                  onChange("sort", event.target.value)
                }
                aria-label="Sort by"
              >
                <option value="default">
                  Default
                </option>

                <option value="rating">
                  Top Rated
                </option>
              </select>

              <ChevronDown
                size={16}
                className="filter-select-icon"
              />
            </label>
          </div>
        </div>

        <div className="filter-drawer-footer">
          <button
            className="filter-reset"
            onClick={onReset}
          >
            <RotateCcw size={14} />
            Reset
          </button>

          <button
            className="filter-apply"
            onClick={() => setIsOpen(false)}
          >
            Show Results
          </button>
        </div>
      </aside>
    </>
  );
}

export default FilterBar;
