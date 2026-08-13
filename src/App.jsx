import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import ShowRow from "./components/ShowRow";
import { getShows } from "./services/api";
import ShowDetails from "./pages/ShowDetails";
import Search from "./pages/Search";
import MyList from "./pages/MyList";
import Movies from "./pages/Movies";
import TVShows from "./pages/TVShows";

function Home() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    async function loadShows() {
      try {
        const data = await getShows();
        setShows(data);
      } catch (error) {
        console.error(error);
      }
    }

    loadShows();
  }, []);

  const trending = shows.slice(0, 10);
  const popular = shows.slice(10, 20);
  const recommended = shows.slice(20, 30);
  const moreShows = shows.slice(30, 40);

  return (
    <>
      <Navbar />

      <Hero shows={shows} />
      <main className="home">

       <h1>Top 10 Today</h1>

      <ShowRow
       shows={trending}
        ranked={true}
       />

       <h1>Popular Shows</h1>

      <ShowRow
      shows={popular}
      />

      <h1>Recommended For You</h1>

     <ShowRow
    shows={recommended}
    />

      <h1>More Shows</h1>

      <ShowRow
     shows={moreShows}
     />

      </main>
    </>
  );
}

function Placeholder({ title }) {
  return (
    <>
      <Navbar />

      <main className="placeholder">
        <h1>{title}</h1>
        <p>Coming soon...</p>
      </main>
    </>
  );
}

function App() {
  return (
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
  );
}

export default App;