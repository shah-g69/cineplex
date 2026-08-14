import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import ShowCard from "./Showcard";

function ShowRow({ shows = [], ranked = false }) {
  const rowRef = useRef(null);

  function scrollLeft() {
    if (!rowRef.current) {
      return;
    }

    rowRef.current.scrollBy({
      left: -700,
      behavior: "smooth",
    });
  }

  function scrollRight() {
    if (!rowRef.current) {
      return;
    }

    rowRef.current.scrollBy({
      left: 700,
      behavior: "smooth",
    });
  }

  return (
    <div className="show-row-container">

      <button
        className="row-arrow row-arrow-left"
        onClick={scrollLeft}
        aria-label="Previous shows"
      >
        <ChevronLeft size={30} />
      </button>

      <div
        className="show-row"
        ref={rowRef}
      >
        {shows.map((show, index) => (
          <div
            className={
              ranked
                ? "ranked-card"
                : "normal-card"
            }
            key={show.id}
          >

            {ranked && (
              <div className="rank-number">
                {index + 1}
              </div>
            )}

            <ShowCard show={show} />

          </div>
        ))}
      </div>

      <button
        className="row-arrow row-arrow-right"
        onClick={scrollRight}
        aria-label="Next shows"
      >
        <ChevronRight size={30} />
      </button>

    </div>
  );
}

export default ShowRow;