// src/components/movies/MovieGrid.tsx
import type { Movie } from "../../types/movie";
import MovieCard from "./MovieCard";

interface MovieGridProps {
  movies: Movie[];
  emptyMessage?: string;
}

export default function MovieGrid({
  movies,
  emptyMessage = "No movies available in this category.",
}: MovieGridProps) {
  if (movies.length === 0) {
    return (
      <div className="py-16 text-center bg-card/40 rounded-2xl border border-white/5 p-8">
        <p className="text-secondary-text text-base">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {movies.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
