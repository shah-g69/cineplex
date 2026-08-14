import { useMemo, useState } from "react";

import {
  applyFilters,
  getFilterOptions,
  sortShows,
} from "../utils/filters";

const EMPTY_FILTERS = {
  genres: [],
  year: "",
  country: "",
  language: "",
  sort: "default",
};

export function useFilters(shows) {
  const [filters, setFilters] = useState(EMPTY_FILTERS);

  const options = useMemo(
    () => getFilterOptions(shows),
    [shows]
  );

  const filtered = useMemo(
    () => sortShows(applyFilters(shows, filters), filters.sort),
    [shows, filters]
  );

  // Removable chips for every active filter selection.
  const activeFilters = useMemo(() => {
    const chips = [];

    filters.genres.forEach((genre) =>
      chips.push({
        key: `genre-${genre}`,
        type: "genre",
        value: genre,
        label: genre,
      })
    );

    if (filters.year) {
      chips.push({
        key: "year",
        type: "year",
        value: filters.year,
        label: `Year: ${filters.year}`,
      });
    }

    if (filters.country) {
      chips.push({
        key: "country",
        type: "country",
        value: filters.country,
        label: filters.country,
      });
    }

    if (filters.language) {
      chips.push({
        key: "language",
        type: "language",
        value: filters.language,
        label: filters.language,
      });
    }

    return chips;
  }, [filters]);

  const activeCount = activeFilters.length;

  function toggleGenre(genre) {
    setFilters((previous) => ({
      ...previous,
      genres: previous.genres.includes(genre)
        ? previous.genres.filter((item) => item !== genre)
        : [...previous.genres, genre],
    }));
  }

  function updateFilter(key, value) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }

  function removeFilter(type, value) {
    setFilters((previous) => {
      if (type === "genre") {
        return {
          ...previous,
          genres: previous.genres.filter(
            (item) => item !== value
          ),
        };
      }

      return { ...previous, [type]: "" };
    });
  }

  function resetFilters() {
    setFilters(EMPTY_FILTERS);
  }

  return {
    filters,
    options,
    filtered,
    activeCount,
    activeFilters,
    toggleGenre,
    updateFilter,
    removeFilter,
    resetFilters,
  };
}
