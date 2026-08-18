// ============================================================
// DATA LAYER — The Movie Database (TMDB)
//
// Everything in the app now comes from TMDB, which has both
// real movies and real TV shows (1M+ titles) — a much wider
// catalog than the old TV-only TVMaze API. TMDB items are
// normalized into the app's show shape, so components,
// filters, My List and the trailer system keep working.
//
// API key (v3 auth): https://www.themoviedb.org/settings/api
// ============================================================
const TMDB_API_KEY = "f98ba3a9cbe2bd394302b4a81cc81f69";

const TMDB_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p";

const trailerCache = new Map();

// Genre id -> name, fetched once and cached.
let genreCache = null;

async function fetchJson(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Request failed (${response.status})`);
  }

  return response.json();
}

async function getGenreMap() {
  if (genreCache) {
    return genreCache;
  }

  const [movies, tv] = await Promise.all([
    fetchJson(
      `${TMDB_BASE}/genre/movie/list?api_key=${TMDB_API_KEY}`
    ),
    fetchJson(
      `${TMDB_BASE}/genre/tv/list?api_key=${TMDB_API_KEY}`
    ),
  ]);

  const map = new Map();

  [...movies.genres, ...tv.genres].forEach((genre) =>
    map.set(genre.id, genre.name)
  );

  genreCache = map;
  return map;
}

const languageNames = new Intl.DisplayNames(["en"], {
  type: "language",
});

const countryNames = new Intl.DisplayNames(["en"], {
  type: "region",
});

function displayName(formatter, code) {
  if (!code) {
    return null;
  }

  try {
    return formatter.of(code);
  } catch {
    return code;
  }
}

function posterUrl(path, size) {
  return path ? `${IMAGE_BASE}/${size}${path}` : null;
}

// Converts a raw TMDB movie/tv item into the app's show shape.
async function normalize(item, type) {
  const genreMap = await getGenreMap();

  const genres = item.genres
    ? item.genres.map((genre) => genre.name)
    : (item.genre_ids || [])
        .map((id) => genreMap.get(id))
        .filter(Boolean);

  const date =
    item.release_date || item.first_air_date || null;

  const countryCode = item.origin_country?.[0];

  return {
    id: `${type}-${item.id}`,
    type,
    tmdbId: item.id,
    name: item.title || item.name || "Untitled",
    image: {
      medium: posterUrl(item.poster_path, "w342"),
      original: posterUrl(
        item.backdrop_path || item.poster_path,
        "w1280"
      ),
      poster: posterUrl(item.poster_path, "w500"),
    },
    rating: { average: item.vote_average || 0 },
    premiered: date,
    runtime:
      item.runtime ||
      item.episode_run_time?.[0] ||
      null,
    genres,
    summary: item.overview || "",
    network: {
      country: {
        name: displayName(countryNames, countryCode),
      },
    },
    language: displayName(
      languageNames,
      item.original_language
    ),
    status: item.status || null,
    externals: { tmdb: item.id },
  };
}

async function normalizeList(items, type) {
  const results = [];

  for (const item of items) {
    const itemType =
      typeof type === "function" ? type(item) : type;

    results.push(await normalize(item, itemType));
  }

  return results;
}

// ------------------------------------------------------------
// Catalog
// ------------------------------------------------------------

// What's trending right now (refreshes every day) — powers the
// "Top 10 Today" row on Home.
export async function getTrending() {
  const data = await fetchJson(
    `${TMDB_BASE}/trending/all/day?api_key=${TMDB_API_KEY}`
  );

  return normalizeList(data.results, (item) =>
    item.media_type === "movie" ? "movie" : "tv"
  );
}

export async function getMovies(pages = 3) {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await fetchJson(
      `${TMDB_BASE}/discover/movie?sort_by=popularity.desc&page=${page}&api_key=${TMDB_API_KEY}`
    );

    results.push(
      ...(await normalizeList(data.results, "movie"))
    );
  }

  return results;
}

export async function getTVShows(pages = 3) {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await fetchJson(
      `${TMDB_BASE}/discover/tv?sort_by=popularity.desc&page=${page}&api_key=${TMDB_API_KEY}`
    );

    results.push(
      ...(await normalizeList(data.results, "tv"))
    );
  }

  return results;
}

// Major genres shown as carousels on the Movies / TV pages.
// (TMDB genre ids, distinct for movies and TV.)
export const MOVIE_GENRES = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 35, name: "Comedy" },
  { id: 18, name: "Drama" },
  { id: 27, name: "Horror" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
  { id: 10749, name: "Romance" },
  { id: 16, name: "Animation" },
  { id: 80, name: "Crime" },
];

export const TV_GENRES = [
  { id: 10759, name: "Action & Adventure" },
  { id: 10765, name: "Sci-Fi & Fantasy" },
  { id: 18, name: "Drama" },
  { id: 35, name: "Comedy" },
  { id: 9648, name: "Mystery" },
  { id: 10751, name: "Family" },
  { id: 16, name: "Animation" },
  { id: 80, name: "Crime" },
  { id: 10764, name: "Reality" },
  { id: 10768, name: "War & Politics" },
];

async function discoverByGenre(type, genreId, pages = 2) {
  const results = [];

  for (let page = 1; page <= pages; page++) {
    const data = await fetchJson(
      `${TMDB_BASE}/discover/${type}?with_genres=${genreId}&sort_by=popularity.desc&page=${page}&api_key=${TMDB_API_KEY}`
    );

    results.push(
      ...(await normalizeList(data.results, type))
    );
  }

  return results;
}

// Movies / TV shows by genre — powers the genre carousels
// on the Movies and TV pages.
export async function getMoviesByGenre(genreId, pages = 2) {
  return discoverByGenre("movie", genreId, pages);
}

export async function getTVShowsByGenre(genreId, pages = 2) {
  return discoverByGenre("tv", genreId, pages);
}

export async function searchShows(query) {
  const data = await fetchJson(
    `${TMDB_BASE}/search/multi?query=${encodeURIComponent(
      query
    )}&api_key=${TMDB_API_KEY}`
  );

  const items = (data.results || []).filter(
    (item) =>
      item.media_type === "movie" ||
      item.media_type === "tv"
  );

  return normalizeList(items, (item) =>
    item.media_type === "movie" ? "movie" : "tv"
  );
}

// Fetches a single title by its namespaced id ("movie-123").
// Plain numeric ids are legacy TVMaze shows saved in My List
// before the switch — those are resolved through TVMaze + the
// TMDB find endpoint.
export async function getShowById(id) {
  if (/^\d+$/.test(id)) {
    return resolveLegacyShow(id);
  }

  const [type, rawId] = id.split("-");

  const data = await fetchJson(
    `${TMDB_BASE}/${type}/${rawId}?api_key=${TMDB_API_KEY}`
  );

  return normalize(data, type);
}

async function resolveLegacyShow(tvmazeId) {
  const tvmaze = await fetchJson(
    `https://api.tvmaze.com/shows/${tvmazeId}`
  );

  const externals = tvmaze.externals || {};
  const externalId =
    externals.thetvdb || externals.imdb;
  const source = externals.thetvdb
    ? "tvdb_id"
    : "imdb_id";

  if (!externalId) {
    throw new Error("Show not found");
  }

  const found = await fetchJson(
    `${TMDB_BASE}/find/${externalId}?external_source=${source}&api_key=${TMDB_API_KEY}`
  );

  const mediaType = found.tv_results?.length
    ? "tv"
    : found.movie_results?.length
      ? "movie"
      : null;

  if (!mediaType) {
    throw new Error("Show not found");
  }

  const match =
    mediaType === "tv"
      ? found.tv_results[0]
      : found.movie_results[0];

  const data = await fetchJson(
    `${TMDB_BASE}/${mediaType}/${match.id}?api_key=${TMDB_API_KEY}`
  );

  return normalize(data, mediaType);
}

// ------------------------------------------------------------
// Trailers
// ------------------------------------------------------------

function pickTrailer(videos) {
  const list = videos || [];

  return (
    list.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer" &&
        video.official
    ) ||
    list.find(
      (video) =>
        video.site === "YouTube" &&
        video.type === "Trailer"
    )
  );
}

// Resolves the official trailer embed URL for a show, or null
// when unavailable. Results are cached per title.
export async function getTrailerUrl(show) {
  if (!TMDB_API_KEY) {
    return null;
  }

  // Current shape: native TMDB ids.
  if (show.tmdbId && show.type) {
    const cacheKey = `${show.type}:${show.tmdbId}`;

    if (trailerCache.has(cacheKey)) {
      return trailerCache.get(cacheKey);
    }

    try {
      const videos = await fetchJson(
        `${TMDB_BASE}/${show.type}/${show.tmdbId}/videos?api_key=${TMDB_API_KEY}`
      );

      const trailer = pickTrailer(videos.results);
      const url = trailer
        ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
        : null;

      trailerCache.set(cacheKey, url);
      return url;
    } catch (error) {
      console.error(
        `Failed to resolve trailer for "${show.name}":`,
        error
      );
      trailerCache.set(cacheKey, null);
      return null;
    }
  }

  // Legacy: TVMaze shows saved in My List before the switch.
  const externals = show.externals || {};
  const externalId = externals.thetvdb || externals.imdb;
  const source = externals.thetvdb
    ? "tvdb_id"
    : "imdb_id";

  if (!externalId) {
    return null;
  }

  const cacheKey = `legacy:${source}:${externalId}`;

  if (trailerCache.has(cacheKey)) {
    return trailerCache.get(cacheKey);
  }

  try {
    const found = await fetchJson(
      `${TMDB_BASE}/find/${externalId}?external_source=${source}&api_key=${TMDB_API_KEY}`
    );

    const mediaType = found.tv_results?.length
      ? "tv"
      : found.movie_results?.length
        ? "movie"
        : null;

    if (!mediaType) {
      trailerCache.set(cacheKey, null);
      return null;
    }

    const match =
      mediaType === "tv"
        ? found.tv_results[0]
        : found.movie_results[0];

    const videos = await fetchJson(
      `${TMDB_BASE}/${mediaType}/${match.id}/videos?api_key=${TMDB_API_KEY}`
    );

    const trailer = pickTrailer(videos.results);
    const url = trailer
      ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
      : null;

    trailerCache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error(
      `Failed to resolve trailer for "${show.name}":`,
      error
    );
    trailerCache.set(cacheKey, null);
    return null;
  }
}
