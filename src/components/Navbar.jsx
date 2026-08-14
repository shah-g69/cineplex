import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  Bell,
  User,
  X,
  Menu,
} from "lucide-react";

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const inputRef = useRef(null);

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
            <Search
              size={16}
              className="search-icon"
              aria-hidden="true"
            />

            <input
              ref={inputRef}
              type="text"
              placeholder="Search movies & shows..."
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
                if (search) {
                  // Clear the text and keep typing.
                  setSearch("");
                  inputRef.current?.focus();
                } else {
                  // Nothing to clear — collapse the bar.
                  setSearchOpen(false);
                }
              }}
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          </form>
        )}

        <button
          className="nav-icon"
          onClick={() => {
            setSearchOpen(!searchOpen);
            setMobileOpen(false);
          }}
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

        <button
          className="nav-icon menu-toggle"
          onClick={() => {
            setMobileOpen(!mobileOpen);
            setSearchOpen(false);
          }}
          aria-label="Menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <X size={21} />
          ) : (
            <Menu size={21} />
          )}
        </button>

      </div>

      <div
        className={`mobile-menu ${
          mobileOpen ? "open" : ""
        }`}
      >
        <Link
          to="/"
          onClick={() => setMobileOpen(false)}
        >
          Home
        </Link>

        <Link
          to="/movies"
          onClick={() => setMobileOpen(false)}
        >
          Movies
        </Link>

        <Link
          to="/tv"
          onClick={() => setMobileOpen(false)}
        >
          TV Shows
        </Link>

        <Link
          to="/my-list"
          onClick={() => setMobileOpen(false)}
        >
          My List
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;