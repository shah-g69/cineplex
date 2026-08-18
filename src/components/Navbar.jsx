import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Search,
  Bell,
  User,
  X,
  Menu,
} from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

function formatTime(timestamp) {
  const seconds = Math.floor(
    (Date.now() - timestamp) / 1000
  );

  if (seconds < 60) {
    return "just now";
  }

  const minutes = Math.floor(seconds / 60);

  if (minutes < 60) {
    return `${minutes}m ago`;
  }

  const hours = Math.floor(minutes / 60);

  if (hours < 24) {
    return `${hours}h ago`;
  }

  const days = Math.floor(hours / 24);

  return `${days}d ago`;
}

function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const inputRef = useRef(null);
  const notifRef = useRef(null);

  const {
    notifications,
    unreadCount,
    markAllRead,
    clearNotifications,
    dismissNotification,
  } = useNotifications();

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

  // Close the notification panel when clicking outside it.
  useEffect(() => {
    if (!notifOpen) {
      return;
    }

    function handleClickOutside(event) {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target)
      ) {
        setNotifOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, [notifOpen]);

  function toggleNotifications() {
    setNotifOpen((open) => {
      const next = !open;

      // Opening the panel counts everything as read.
      if (next) {
        markAllRead();
      }

      return next;
    });
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

        <div
          className="notif-wrapper"
          ref={notifRef}
        >

          <button
            className={`nav-icon notif-button ${
              notifOpen ? "active" : ""
            }`}
            onClick={() => {
              setSearchOpen(false);
              setMobileOpen(false);
              toggleNotifications();
            }}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell size={21} strokeWidth={2} />

            {unreadCount > 0 && (
              <span className="notif-badge">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-panel">

              <div className="notif-header">

                <h3>Notifications</h3>

                {notifications.length > 0 && (
                  <button
                    className="notif-clear"
                    onClick={clearNotifications}
                  >
                    Clear all
                  </button>
                )}

              </div>

              {notifications.length === 0 ? (
                <p className="notif-empty">
                  No notifications yet.
                </p>
              ) : (
                <ul className="notif-list">

                  {notifications.map((notification) => (
                    <li
                      className="notif-item"
                      key={notification.id}
                    >

                      <button
                        className="notif-dismiss"
                        onClick={() =>
                          dismissNotification(
                            notification.id
                          )
                        }
                        aria-label="Dismiss notification"
                      >
                        <X size={14} />
                      </button>

                      <p>{notification.message}</p>

                      <span>
                        {formatTime(notification.time)}
                      </span>

                    </li>
                  ))}

                </ul>
              )}

            </div>
          )}

        </div>

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