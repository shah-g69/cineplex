import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ShowRow from "./components/ShowRow";
import Footer from "./components/Footer";
import FilterBar from "./components/FilterBar";
import { useFilters } from "./hooks/useFilters";
import { TrailerProvider } from "./context/TrailerContext";
import { NotificationProvider } from "./context/NotificationContext";
import {
  getMovies,
  getTVShows,
  getTrending,
} from "./services/api";
import ShowDetails from "./pages/ShowDetails";
import Search from "./pages/Search";
import MyList from "./pages/myList";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";

function Home() {
  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [tvShows, setTvShows] = useState([]);

  useEffect(() => {
    async function loadHome() {
      try {
        const [trendingData, moviesData, tvData] =
          await Promise.all([
            getTrending(),
            getMovies(),
            getTVShows(),
          ]);

        setTrending(trendingData);
        setMovies(moviesData);
        setTvShows(tvData);
      } catch (error) {
        console.error(error);
      }
    }

    loadHome();
  }, []);

  const shows = [...movies, ...tvShows];

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

  // The Top 10 row always shows today's real top 10,
  // independent of any active filters.
  const top10 = trending.slice(0, 10);
  const top10Ids = new Set(
    top10.map((show) => show.id)
  );

  // Filtered pool (Top 10 excluded so rows don't repeat it).
  const pool = filtered.filter(
    (show) => !top10Ids.has(show.id)
  );

  const popularMovies = pool
    .filter((show) => show.type === "movie")
    .slice(0, 10);

  const popularShows = pool
    .filter((show) => show.type === "tv")
    .slice(0, 10);

  const shownIds = new Set(
    [...popularMovies, ...popularShows].map(
      (show) => show.id
    )
  );

  const more = pool
    .filter((show) => !shownIds.has(show.id))
    .slice(0, 10);

  const moreIds = new Set(
    more.map((show) => show.id)
  );

  const recommended = pool
    .filter(
      (show) =>
        !shownIds.has(show.id) &&
        !moreIds.has(show.id)
    )
    .slice(0, 10);

  return (
    <>
      <Navbar />

      <Hero shows={trending} />
      <main className="home">

       {top10.length > 0 && (
         <>
           <h1 id="top10">Top 10 Today</h1>

           <ShowRow
             shows={top10}
             ranked={true}
           />
         </>
       )}

       {/* Filters apply to the rows below; the Top 10 row stays untouched. */}
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

       {popularMovies.length > 0 && (
         <>
           <h1>Popular Movies</h1>

           <ShowRow shows={popularMovies} />
         </>
       )}

       {popularShows.length > 0 && (
         <>
           <h1>Popular Shows</h1>

           <ShowRow shows={popularShows} />
         </>
       )}

       {more.length > 0 && (
         <>
           <h1>More To Watch</h1>

           <ShowRow shows={more} />
         </>
       )}

       {recommended.length > 0 && (
         <>
           <h1>Recommended For You</h1>

           <ShowRow shows={recommended} />
         </>
       )}

      </main>
    </>
  );
}

function App() {
  return (
    <TrailerProvider>
    <NotificationProvider>
    <Routes>
    <Route
    path="/show/:id"
    element={<ShowDetails />}
    />
      <Route
        path="/"
        element={<Home />}
      />

      <Route
      path="/movies"
      element={<Movies />}
       />

      <Route
      path="/tv"
      element={<TVShows />}
      />

       <Route
      path="/my-list"
       element={<MyList />}
       />
      <Route
      path="/search"
      element={<Search />}
      />
    </Routes>

    <Footer />
    </NotificationProvider>
    </TrailerProvider>
  );
}

export default App;