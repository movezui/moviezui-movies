// src/components/movies/TrailerModal.tsx
import { useEffect } from "react";
import { X, Film } from "lucide-react";

interface TrailerModalProps {
  isOpen: boolean;
  onClose: () => void;
  trailerYoutubeId?: string;
  movieTitle: string;
}

export default function TrailerModal({
  isOpen,
  onClose,
  trailerYoutubeId,
  movieTitle,
}: TrailerModalProps) {
  // Listen for Escape key
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    // Prevent background scrolling while modal is open
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !trailerYoutubeId) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="trailer-modal-title"
    >
      <div
        className="relative w-full max-w-4xl bg-card border border-white/10 rounded-2xl sm:rounded-3xl shadow-2xl shadow-black/90 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/10 bg-backgroundSecondary/80">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0">
              <Film size={16} />
            </div>
            <div className="min-w-0">
              <h2
                id="trailer-modal-title"
                className="text-sm sm:text-base font-bold text-white font-heading truncate"
              >
                {movieTitle}
              </h2>
              <span className="text-[11px] text-secondary-text block -mt-0.5">
                Official YouTube Trailer
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-secondary-text hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
            aria-label="Close trailer modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* 16:9 Video Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${trailerYoutubeId}?autoplay=1&rel=0&modestbranding=1`}
            title={`${movieTitle} Official Trailer`}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
}
