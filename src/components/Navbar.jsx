import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  Bell,
  User,
  X,
} from "lucide-react";

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () => {
      window.removeEventListener(
        "scroll",
        handleScroll
      );
    };
  }, []);

  function handleSearch(event) {
    event.preventDefault();

    if (!search.trim()) {
      return;
    }

    navigate(
      `/search?q=${encodeURIComponent(search)}`
    );

    setSearchOpen(false);
    setSearch("");
  }

  return (
    <nav
      className={`navbar ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <Link to="/" className="logo">
        CineFlix
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        <Link to="/movies">
          Movies
        </Link>

        <Link to="/tv">
          TV Shows
        </Link>

        <Link to="/my-list">
          My List
        </Link>
      </div>

      <div className="nav-right">

        {searchOpen && (
          <form
            className="search-form"
            onSubmit={handleSearch}
          >
            <input
              type="text"
              placeholder="Search shows..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              autoFocus
            />

            <button
              type="button"
              className="search-close"
              onClick={() => {
                setSearchOpen(false);
                setSearch("");
              }}
            >
              <X size={19} />
            </button>
          </form>
        )}

        <button
          className="nav-icon"
          onClick={() =>
            setSearchOpen(!searchOpen)
          }
          aria-label="Search"
        >
          <Search size={21} strokeWidth={2} />
        </button>

        <button
          className="nav-icon"
          aria-label="Notifications"
        >
          <Bell size={21} strokeWidth={2} />
        </button>

        <button
          className="nav-icon profile-icon"
          aria-label="Profile"
        >
          <User size={20} strokeWidth={2} />
        </button>

      </div>
    </nav>
  );
}

export default Navbar;