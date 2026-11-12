// src/components/movies/MovieCard.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, Film } from "lucide-react";
import type { Movie } from "../../types/movie";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group relative bg-card rounded-xl overflow-hidden border border-white/5 shadow-md hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col h-full">
      <Link
        to={`/movie/${movie.slug}`}
        className="block flex-1 flex flex-col"
        aria-label={`View details for ${movie.title}`}
      >
        {/* Poster Image with consistent 2:3 aspect ratio */}
        <div className="relative aspect-[2/3] w-full overflow-hidden bg-backgroundSecondary">
          {!imgError ? (
            <img
              src={movie.poster}
              alt={`${movie.title} Poster`}
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-gradient-to-br from-card to-backgroundSecondary border-b border-white/5">
              <Film size={36} className="text-primary/40 mb-2" />
              <span className="text-xs font-medium text-secondary-text line-clamp-2 px-2">
                {movie.title}
              </span>
            </div>
          )}

          {/* Top badges overlay */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-black/75 backdrop-blur-md text-white border border-white/10 shadow-sm">
              {movie.releaseYear}
            </span>
            {movie.imdbRating !== null && movie.imdbRating !== undefined && (
              <span className="flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-bold bg-black/80 backdrop-blur-md text-primary border border-primary/30 shadow-sm">
                <Star size={12} className="fill-primary text-primary" />
                <span>{movie.imdbRating.toFixed(1)}</span>
              </span>
            )}
          </div>

          {/* Subtle bottom gradient on poster for contrast */}
          <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-80" />
        </div>

        {/* Card Body */}
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap gap-1 mb-2">
              {movie.genres.slice(0, 2).map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-secondary-text border border-white/5"
                >
                  {genre}
                </span>
              ))}
            </div>
            <h3 className="font-heading font-semibold text-base text-white group-hover:text-primary transition-colors line-clamp-1 mb-1">
              {movie.title}
            </h3>
            <p className="text-xs text-secondary-text line-clamp-2 leading-relaxed">
              {movie.description}
            </p>
          </div>

          <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-secondary-text">
            <span className="truncate max-w-[130px]">Dir: {movie.director}</span>
            {movie.runtime && <span>{movie.runtime} min</span>}
          </div>
        </div>
      </Link>
    </div>
  );
}
