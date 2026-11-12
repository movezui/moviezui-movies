// src/pages/MovieDetails.tsx
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Star,
  Clock,
  Calendar,
  Globe,
  User,
  Users,
  ArrowLeft,
  Film,
  Sparkles,
  Clapperboard,
} from "lucide-react";
import MovieCard from "../components/movies/MovieCard";
import SectionHeading from "../components/movies/SectionHeading";
import WhereToWatch from "../components/movies/WhereToWatch";
import { movies } from "../data/movies";

export default function MovieDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [imgError, setImgError] = useState(false);

  const movie = movies.find((m) => m.slug === slug);

  if (!movie) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-secondary-text">
          <Film size={36} />
        </div>
        <h1 className="text-3xl font-extrabold font-heading text-white">Movie Not Found</h1>
        <p className="text-secondary-text max-w-md mx-auto">
          We could not find the movie you were looking for. It may have been removed or the link might be incorrect.
        </p>
        <div>
          <Link
            to="/movies"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition shadow-lg"
          >
            <ArrowLeft size={16} />
            <span>Back to All Movies</span>
          </Link>
        </div>
      </div>
    );
  }

  // Related movies: share at least one genre, exclude self
  const relatedMovies = movies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
    .slice(0, 4);

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      {/* Top Banner & Breadcrumb */}
      <div className="relative pt-6 pb-2 border-b border-white/5 bg-backgroundSecondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-xs text-secondary-text overflow-hidden">
            <Link to="/" className="hover:text-primary transition shrink-0">Home</Link>
            <span className="shrink-0">/</span>
            <Link to="/movies" className="hover:text-primary transition shrink-0">Movies</Link>
            <span className="shrink-0">/</span>
            <span className="text-white font-medium truncate max-w-[140px] sm:max-w-xs">{movie.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Large Poster */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-4 sm:space-y-6 max-w-sm sm:max-w-md mx-auto lg:max-w-none">
              <div className="relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-white/10 shadow-2xl shadow-black/80">
                {!imgError ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} Poster`}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                    loading="eager"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-card">
                    <Film size={48} className="text-primary/40 mb-3" />
                    <span className="text-base font-semibold text-white">{movie.title}</span>
                    <span className="text-xs text-secondary-text mt-1">{movie.releaseYear}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Link
                  to="/movies"
                  className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-card hover:bg-card/80 text-white font-semibold text-sm border border-white/10 hover:border-primary/50 transition shadow"
                >
                  <ArrowLeft size={16} className="text-primary" />
                  <span>Browse More Movies</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Information */}
          <div className="lg:col-span-8 xl:col-span-8 space-y-6 sm:space-y-8 min-w-0">
            
            {/* Header info */}
            <div className="space-y-3 border-b border-white/10 pb-6">
              <div className="flex flex-wrap items-center gap-2">
                {movie.genres.map((g) => (
                  <Link
                    key={g}
                    to={`/movies?genre=${encodeURIComponent(g)}`}
                    className="text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition font-medium"
                  >
                    {g}
                  </Link>
                ))}
                {movie.featured && (
                  <span className="inline-flex items-center space-x-1 text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-semibold">
                    <Sparkles size={12} />
                    <span>Featured Film</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight break-words">
                {movie.title}
              </h1>

              {/* Meta stats bar */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-secondary-text pt-2">
                <span className="flex items-center space-x-1.5">
                  <Calendar size={15} className="text-primary shrink-0" />
                  <span className="text-white font-medium">{movie.releaseYear}</span>
                </span>
                {movie.runtime && (
                  <span className="flex items-center space-x-1.5">
                    <Clock size={15} className="text-primary shrink-0" />
                    <span>{movie.runtime} min</span>
                  </span>
                )}
                <span className="flex items-center space-x-1.5">
                  <Globe size={15} className="text-primary shrink-0" />
                  <span>{movie.language}</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <Clapperboard size={15} className="text-primary shrink-0" />
                  <span>{movie.industry}</span>
                </span>
                {movie.imdbRating !== null && movie.imdbRating !== undefined ? (
                  <span className="flex items-center space-x-1.5 px-3 py-0.5 rounded-full bg-black/60 border border-primary/30 text-primary font-bold">
                    <Star size={13} className="fill-primary shrink-0" />
                    <span>{movie.imdbRating.toFixed(1)} / 10 IMDb</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-secondary-text text-xs">
                    Rating Unrated
                  </span>
                )}
              </div>
            </div>

            {/* Synopsis */}
            <div className="space-y-2.5 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-bold font-heading text-white flex items-center space-x-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                <span>Synopsis & Overview</span>
              </h2>
              <p className="text-secondary-text text-sm sm:text-base md:text-lg leading-relaxed font-light break-words">
                {movie.description}
              </p>
            </div>

            {/* Credits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-card/60 p-4 sm:p-6 rounded-2xl border border-white/5 shadow-md">
              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2 text-primary text-xs uppercase tracking-wider font-semibold">
                  <User size={14} className="shrink-0" />
                  <span>Director</span>
                </div>
                <p className="text-white text-sm sm:text-base font-medium break-words">{movie.director}</p>
              </div>

              <div className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center space-x-2 text-primary text-xs uppercase tracking-wider font-semibold">
                  <Users size={14} className="shrink-0" />
                  <span>Main Cast</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {movie.cast.map((actor) => (
                    <span
                      key={actor}
                      className="px-2.5 py-1 rounded-lg bg-backgroundSecondary text-white/90 text-xs border border-white/5 font-medium break-words"
                    >
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Movie Facts Grid */}
            <div className="p-4 sm:p-6 rounded-2xl bg-backgroundSecondary/40 border border-white/5 space-y-3 sm:space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white font-heading">
                Film Details & Heritage
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 text-xs">
                <div className="min-w-0">
                  <span className="text-secondary-text block truncate">Language</span>
                  <span className="text-white font-medium block truncate">{movie.language}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-secondary-text block truncate">Film Industry</span>
                  <span className="text-white font-medium block truncate">{movie.industry}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-secondary-text block truncate">Release Year</span>
                  <span className="text-white font-medium block truncate">{movie.releaseYear}</span>
                </div>
                <div className="min-w-0">
                  <span className="text-secondary-text block truncate">Runtime</span>
                  <span className="text-white font-medium block truncate">{movie.runtime ? `${movie.runtime} min` : "Feature Film"}</span>
                </div>
              </div>
            </div>

            {/* Where to Watch Section */}
            <WhereToWatch watchOptions={movie.watchOptions} movieTitle={movie.title} />
          </div>
        </div>
      </div>

      {/* Related Movies */}
      {relatedMovies.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 sm:pt-8">
          <SectionHeading
            title="More Like This"
            subtitle={`Explore other ${movie.genres[0]} movies you might enjoy.`}
            actionText="View all movies"
            actionTo="/movies"
          />
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {relatedMovies.map((relMovie) => (
              <MovieCard key={relMovie.id} movie={relMovie} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
