import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar";

import {
  addToMyList,
  removeFromMyList,
  isInMyList,
} from "../utils/myList";

function ShowDetails() {
  const { id } = useParams();

  const [show, setShow] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadShow() {
      try {
        const response = await fetch(
          `https://api.tvmaze.com/shows/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load show");
        }

        const data = await response.json();

        setShow(data);

        setSaved(isInMyList(data.id));
      } catch (error) {
        console.error(error);
      }
    }

    loadShow();
  }, [id]);

  function handleMyList() {
    if (!show) {
      return;
    }

    if (saved) {
      removeFromMyList(show.id);
      setSaved(false);
    } else {
      addToMyList(show);
      setSaved(true);
    }
  }

  if (!show) {
    return (
      <>
        <Navbar />

        <div className="loading">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main
        className="details-page"
        style={{
          backgroundImage: `
            linear-gradient(
              to right,
              rgba(17, 17, 17, 1) 0%,
              rgba(17, 17, 17, 0.85) 45%,
              rgba(17, 17, 17, 0.45) 100%
            ),
            linear-gradient(
              to top,
              #111 0%,
              transparent 60%
            ),
            url(${show.image?.original})
          `,
        }}
      >
        <div className="details-content">

          <Link
            to="/"
            className="back-button"
          >
            ← Back
          </Link>

          <h1>{show.name}</h1>

          <div className="details-info">

            <span>
              ⭐ {show.rating?.average || "N/A"}
            </span>

            <span>
              {show.premiered?.slice(0, 4) || "N/A"}
            </span>

            <span>
              {show.status}
            </span>

            <span>
              {show.runtime
                ? `${show.runtime} min`
                : "N/A"}
            </span>

          </div>

          <div
            className="details-description"
            dangerouslySetInnerHTML={{
              __html:
                show.summary ||
                "No description available.",
            }}
          />

          <div className="genres">

            {show.genres?.map((genre) => (
              <span key={genre}>
                {genre}
              </span>
            ))}

          </div>

          <div className="details-buttons">

            <button className="play-button">
              ▶ Play
            </button>

            <button
              className="info-button"
              onClick={handleMyList}
            >
              {saved
                ? "✓ In My List"
                : "+ My List"}
            </button>

          </div>

        </div>
      </main>
    </>
  );
}

export default ShowDetails;