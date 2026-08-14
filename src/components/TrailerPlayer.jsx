import { X } from "lucide-react";

function TrailerPlayer({
  videoUrl,
  onClose,
  loading = false,
}) {
  const isYouTube = videoUrl?.includes("/embed");

  return (
    <div
      className="trailer-overlay"
      onClick={onClose}
    >

      <div
        className="trailer-player"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        <button
          className="trailer-close"
          onClick={onClose}
          aria-label="Close trailer"
        >
          <X size={28} />
        </button>

        {loading || !videoUrl ? (
          <div className="trailer-loading">
            <div className="trailer-spinner" />
            Loading trailer...
          </div>
        ) : isYouTube ? (
          <iframe
            className="trailer-video"
            src={videoUrl}
            title="Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        ) : (
          <video
            src={videoUrl}
            controls
            autoPlay
            className="trailer-video"
          />
        )}

      </div>

    </div>
  );
}

export default TrailerPlayer;