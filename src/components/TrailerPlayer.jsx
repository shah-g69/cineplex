import { X } from "lucide-react";

function TrailerPlayer({ videoUrl, onClose }) {
  if (!videoUrl) {
    return null;
  }

  return (
    <div className="trailer-overlay">

      <div className="trailer-player">

        <button
          className="trailer-close"
          onClick={onClose}
          aria-label="Close trailer"
        >
          <X size={28} />
        </button>

        <video
          src={videoUrl}
          controls
          autoPlay
          className="trailer-video"
        />

      </div>

    </div>
  );
}

export default TrailerPlayer;