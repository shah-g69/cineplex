import { Link } from "react-router-dom";
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

function ShowCard({ show }) {
  const [saved, setSaved] = useState(
    isInMyList(show.id)
  );

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
                aria-label="Play"
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

              <Link
                to={`/show/${show.id}`}
                className="card-icon"
                aria-label="More Info"
              >
                <Info size={17} />
              </Link>

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