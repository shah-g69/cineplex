import { Link, useNavigate } from "react-router-dom";
import {
  Play,
  Plus,
  Check,
  Info,
} from "lucide-react";
import { useState } from "react";

import {
  addToMyList,
  removeFromMyList,
  isInMyList,
} from "../utils/myList";
import { useTrailer } from "../context/TrailerContext";

function ShowCard({ show }) {
  const [saved, setSaved] = useState(
    isInMyList(show.id)
  );

  const { playTrailer } = useTrailer();

  const navigate = useNavigate();

  function handleMyList(event) {
    event.preventDefault();
    event.stopPropagation();

    if (saved) {
      removeFromMyList(show.id);
      setSaved(false);
    } else {
      addToMyList(show);
      setSaved(true);
    }
  }

  return (
    <div className="show-card">

      <Link to={`/show/${show.id}`}>

        <div className="show-image-wrapper">

          <img
            src={
              show.image?.medium ||
              show.image?.original
            }
            alt={show.name}
          />

          <div className="show-hover">

            <div className="show-actions">

              <button
                className="card-play"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  playTrailer(show);
                }}
                aria-label="Play trailer"
              >
                <Play
                  size={16}
                  fill="currentColor"
                />
              </button>

              <button
                className="card-icon"
                onClick={handleMyList}
                aria-label="My List"
              >
                {saved ? (
                  <Check size={17} />
                ) : (
                  <Plus size={17} />
                )}
              </button>

              <button
                className="card-icon"
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  navigate(`/show/${show.id}`);
                }}
                aria-label="More Info"
              >
                <Info size={17} />
              </button>

            </div>

            <div className="card-meta">

              <span>
                ⭐ {show.rating?.average || "N/A"}
              </span>

              <span>
                {show.premiered?.slice(0, 4) ||
                  "N/A"}
              </span>

            </div>

          </div>

        </div>

        <div className="show-card-info">

          <h2>{show.name}</h2>

          <p>
            {show.genres?.slice(0, 2).join(" • ") ||
              "TV Show"}
          </p>

        </div>

      </Link>

    </div>
  );
}

export default ShowCard;