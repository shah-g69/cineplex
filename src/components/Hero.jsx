import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Info,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { useTrailer } from "../context/TrailerContext";

function Hero({ shows = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const { playTrailer, isOpen } = useTrailer();

  function handlePlay() {
    playTrailer(show);
  }

  const heroShows = shows
    .filter((show) => show.image?.original)
    .slice(0, 5);

  useEffect(() => {
    if (heroShows.length <= 1 || isOpen) {
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex((previousIndex) =>
        previousIndex === heroShows.length - 1
          ? 0
          : previousIndex + 1
      );
    }, 7000);

    return () => clearInterval(interval);
  }, [heroShows.length, isOpen]);

  if (heroShows.length === 0) {
    return null;
  }

  const show = heroShows[currentIndex];

  function nextSlide() {
    setCurrentIndex((previousIndex) =>
      previousIndex === heroShows.length - 1
        ? 0
        : previousIndex + 1
    );
  }

  function previousSlide() {
    setCurrentIndex((previousIndex) =>
      previousIndex === 0
        ? heroShows.length - 1
        : previousIndex - 1
    );
  }

  const description =
    show.summary
      ?.replace(/<[^>]+>/g, "")
      .slice(0, 280) ||
    "Discover this featured title on CineFlix.";

  return (
    <>
      <section
        className="hero"
        style={{
          backgroundImage: `url(${show.image.original})`,
        }}
      >
        <div className="hero-gradient" />

        {show.image?.poster && (
          <div
            className="hero-poster"
            style={{
              backgroundImage: `url(${show.image.poster})`,
            }}
          />
        )}

        <div className="hero-overlay">

          <div className="hero-content">

            <span className="hero-label">
              FEATURED
            </span>

            <h1>{show.name}</h1>

            <div className="hero-info">

              <span>
                ⭐ {show.rating?.average || "N/A"}
              </span>

              <span>
                {show.premiered?.slice(0, 4) || "N/A"}
              </span>

              <span>
                {show.runtime
                  ? `${show.runtime} min`
                  : "N/A"}
              </span>

            </div>

            <p>{description}...</p>

            <div className="hero-buttons">

              <button
                className="play-button"
                onClick={handlePlay}
              >
                <Play
                  size={18}
                  fill="currentColor"
                />
                Play
              </button>

              <button
                className="info-button"
                onClick={() =>
                  navigate(`/show/${show.id}`)
                }
              >
                <Info size={18} />
                More Info
              </button>

            </div>

          </div>

          <button
            className="hero-arrow hero-arrow-left"
            onClick={previousSlide}
            aria-label="Previous"
          >
            <ChevronLeft size={30} />
          </button>

          <button
            className="hero-arrow hero-arrow-right"
            onClick={nextSlide}
            aria-label="Next"
          >
            <ChevronRight size={30} />
          </button>

          <div className="hero-indicators">

            {heroShows.map((item, index) => (
              <button
                key={item.id}
                className={
                  index === currentIndex
                    ? "hero-indicator active"
                    : "hero-indicator"
                }
                onClick={() =>
                  setCurrentIndex(index)
                }
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}

          </div>

        </div>
      </section>

    </>
  );
}

export default Hero;