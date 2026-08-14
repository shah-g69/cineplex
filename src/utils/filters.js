function safeList(value) {
  return value || [];
}

function uniqueSorted(values) {
  return [...new Set(values.filter(Boolean))].sort((a, b) =>
    a.localeCompare(b)
  );
}

// Collects the available filter options from a list of shows.
export function getFilterOptions(shows) {
  const genres = [];
  const years = [];
  const countries = [];
  const languages = [];

  shows.forEach((show) => {
    safeList(show.genres).forEach((genre) => genres.push(genre));

    const year = show.premiered?.slice(0, 4);
    if (year) {
      years.push(year);
    }

    const country =
      show.network?.country?.name ||
      show.webChannel?.country?.name;
    if (country) {
      countries.push(country);
    }

    if (show.language) {
      languages.push(show.language);
    }
  });

  return {
    genres: uniqueSorted(genres),
    years: uniqueSorted(years).reverse(), // newest first
    countries: uniqueSorted(countries),
    languages: uniqueSorted(languages),
  };
}

// Filters a list of shows by genres (multi-select) /
// year / country / language.
export function applyFilters(shows, filters = {}) {
  return shows.filter((show) => {
    if (filters.genres?.length) {
      const matchesGenre = filters.genres.some((genre) =>
        safeList(show.genres).includes(genre)
      );

      if (!matchesGenre) {
        return false;
      }
    }

    if (
      filters.year &&
      show.premiered?.slice(0, 4) !== filters.year
    ) {
      return false;
    }

    if (filters.country) {
      const country =
        show.network?.country?.name ||
        show.webChannel?.country?.name;

      if (country !== filters.country) {
        return false;
      }
    }

    if (filters.language && show.language !== filters.language) {
      return false;
    }

    return true;
  });
}

// Sorts shows ("rating" puts highest rated first, nulls last).
export function sortShows(shows, sort) {
  if (sort !== "rating") {
    return shows;
  }

  return [...shows].sort(
    (a, b) =>
      (b.rating?.average || 0) - (a.rating?.average || 0)
  );
}
