import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import ShowCard from "../components/ShowCard";

import {
  getMyList,
  removeFromMyList,
} from "../utils/myList";

function MyList() {
  const [shows, setShows] = useState([]);

  useEffect(() => {
    setShows(getMyList());
  }, []);

  function handleRemove(id) {
    const updatedList = removeFromMyList(id);

    setShows(updatedList);
  }

  return (
    <>
      <Navbar />

      <main className="my-list-page">

        <h1>My List</h1>

        {shows.length === 0 && (
          <div className="empty-list">

            <h2>Your list is empty</h2>

            <p>
              Shows you add to My List will
              appear here.
            </p>

          </div>
        )}

        {shows.length > 0 && (
          <div className="my-list-grid">

            {shows.map((show) => (
              <div
                className="my-list-item"
                key={show.id}
              >

                <ShowCard show={show} />

                <button
                  className="remove-button"
                  onClick={() =>
                    handleRemove(show.id)
                  }
                >
                  ✕ Remove
                </button>

              </div>
            ))}

          </div>
        )}

      </main>
    </>
  );
}

export default MyList;