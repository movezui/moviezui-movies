// src/components/movies/FeaturedMovie.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Play, Film } from "lucide-react";
import type { Movie } from "../../types/movie";

interface FeaturedMovieProps {
  movie: Movie;
}

export default function FeaturedMovie({ movie }: FeaturedMovieProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-card border border-white/10 shadow-xl hover:border-primary/50 transition-all duration-300 flex flex-col md:flex-row">
      {/* Poster */}
      <div className="relative w-full md:w-48 aspect-[2/3] md:aspect-auto flex-shrink-0 overflow-hidden bg-backgroundSecondary">
        {!imgError ? (
          <img
            src={movie.poster}
            alt={movie.title}
            loading="lazy"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center p-4 bg-card text-secondary-text">
            <Film size={40} className="text-primary/40 mb-2" />
            <span className="text-xs">{movie.title}</span>
          </div>
        )}
        <div className="absolute top-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary text-background">
          Featured
        </div>
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <div className="flex flex-wrap gap-1.5">
              {movie.genres.map((g) => (
                <span
                  key={g}
                  className="text-[11px] uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
                >
                  {g}
                </span>
              ))}
            </div>
            {movie.imdbRating !== null && movie.imdbRating !== undefined && (
              <div className="flex items-center space-x-1 text-primary text-sm font-bold bg-black/60 px-2 py-0.5 rounded-md border border-primary/20">
                <Star size={14} className="fill-primary" />
                <span>{movie.imdbRating.toFixed(1)}</span>
              </div>
            )}
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-heading text-white group-hover:text-primary transition-colors mb-2">
            {movie.title}
          </h3>

          <p className="text-xs text-secondary-text mb-3">
            {movie.releaseYear} • Directed by <span className="text-white font-medium">{movie.director}</span> • {movie.runtime} min
          </p>

          <p className="text-sm text-secondary-text line-clamp-3 leading-relaxed mb-4">
            {movie.description}
          </p>
        </div>

        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="text-xs text-secondary-text truncate max-w-[200px]">
            <span className="text-white/60">Cast: </span>
            {movie.cast.slice(0, 3).join(", ")}
          </div>
          <Link
            to={`/movie/${movie.slug}`}
            className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-primary hover:bg-primary/90 text-background font-semibold text-xs transition shadow-md"
          >
            <Play size={12} className="fill-background" />
            <span>Explore</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
