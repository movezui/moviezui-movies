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
  Play,
  Award,
  Building2,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import MovieCard from "../components/movies/MovieCard";
import SectionHeading from "../components/movies/SectionHeading";
import WhereToWatch from "../components/movies/WhereToWatch";
import TrailerModal from "../components/movies/TrailerModal";
import { movies } from "../data/movies";
import SEO from "../components/common/SEO";
import { createMovieSchema, createBreadcrumbSchema } from "../utils/schema";

export default function MovieDetails() {
  const { slug } = useParams<{ slug: string }>();
  const [imgError, setImgError] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

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

  const movieSchema = createMovieSchema(movie);
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Movies", path: "/movies" },
    { name: movie.title, path: `/movie/${movie.slug}` },
  ]);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16">
      <SEO
        title={`${movie.title} (${movie.releaseYear}) – Cast, Story, Details & Where to Watch`}
        description={
          movie.description.length > 160
            ? `${movie.description.slice(0, 155)}...`
            : movie.description
        }
        canonicalPath={`/movie/${movie.slug}`}
        ogImage={movie.poster}
        ogType="video.movie"
        schema={[movieSchema, breadcrumbSchema]}
      />

      {/* Embedded YouTube Trailer Modal */}
      <TrailerModal
        isOpen={trailerOpen}
        onClose={() => setTrailerOpen(false)}
        trailerYoutubeId={movie.trailerYoutubeId}
        movieTitle={movie.title}
      />

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
          
          {/* Left Column: Large Poster & Quick Actions */}
          <div className="lg:col-span-4 xl:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-4 sm:space-y-6 max-w-sm sm:max-w-md mx-auto lg:max-w-none">
              <div className="group relative aspect-[2/3] rounded-2xl overflow-hidden bg-card border border-white/10 shadow-2xl shadow-black/80">
                {!imgError ? (
                  <img
                    src={movie.poster}
                    alt={`${movie.title} (${movie.releaseYear}) Official Movie Poster`}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover"
                    loading="eager"
                    fetchPriority="high"
                    width={400}
                    height={600}
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-card">
                    <Film size={48} className="text-primary/40 mb-3" />
                    <span className="text-base font-semibold text-white">{movie.title}</span>
                    <span className="text-xs text-secondary-text mt-1">{movie.releaseYear}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Quick Trailer Play Button overlay if trailer is present */}
                {movie.trailerYoutubeId && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-secondary/90 hover:bg-secondary text-white flex items-center justify-center shadow-2xl shadow-secondary/50 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer focus:outline-none focus:ring-4 focus:ring-secondary/50 opacity-90 hover:opacity-100"
                    aria-label={`Play trailer for ${movie.title}`}
                  >
                    <Play size={24} className="fill-white translate-x-0.5" />
                  </button>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5">
                {movie.trailerYoutubeId && (
                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-secondary/20 cursor-pointer"
                  >
                    <Play size={16} className="fill-white" />
                    <span>Watch Trailer</span>
                  </button>
                )}

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

          {/* Right Column: Information & Editorial Sections */}
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
                {movie.ageRating && (
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/15">
                    {movie.ageRating}
                  </span>
                )}
                {movie.featured && (
                  <span className="inline-flex items-center space-x-1 text-xs uppercase tracking-wider px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-semibold">
                    <Sparkles size={12} />
                    <span>Featured Film</span>
                  </span>
                )}
              </div>

              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold font-heading text-white tracking-tight break-words">
                  {movie.title}
                </h1>
                {movie.originalTitle && movie.originalTitle !== movie.title && (
                  <p className="text-xs sm:text-sm text-secondary-text font-normal">
                    Original Title: <span className="text-white/90">{movie.originalTitle}</span>
                  </p>
                )}
                {movie.tagline && (
                  <p className="text-sm sm:text-base italic text-primary/90 font-medium pt-1">
                    &ldquo;{movie.tagline}&rdquo;
                  </p>
                )}
              </div>

              {/* Meta stats bar */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 text-xs sm:text-sm text-secondary-text pt-2">
                <span className="flex items-center space-x-1.5">
                  <Calendar size={15} className="text-primary shrink-0" />
                  <span className="text-white font-medium">{movie.releaseDate || movie.releaseYear}</span>
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

            {/* About This Movie (Expanded Description) */}
            <div className="space-y-2.5 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-bold font-heading text-white flex items-center space-x-2">
                <div className="w-1.5 h-4 bg-primary rounded-full" />
                <span>About This Movie</span>
              </h2>
              <p className="text-secondary-text text-sm sm:text-base leading-relaxed font-light break-words">
                {movie.description}
              </p>
            </div>

            {/* What Makes It Worth Watching Editorial Box */}
            {movie.worthWatching && (
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/20 space-y-2 shadow-sm">
                <div className="flex items-center space-x-2 text-primary font-bold text-xs uppercase tracking-wider">
                  <Sparkles size={14} className="fill-primary" />
                  <span>What Makes It Worth Watching</span>
                </div>
                <p className="text-white/90 text-xs sm:text-sm leading-relaxed font-light">
                  {movie.worthWatching}
                </p>
              </div>
            )}

            {/* Cast & Crew Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 bg-card/60 p-4 sm:p-6 rounded-2xl border border-white/5 shadow-md">
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2 text-primary text-xs uppercase tracking-wider font-semibold">
                    <User size={14} className="shrink-0" />
                    <span>Director</span>
                  </div>
                  <p className="text-white text-sm sm:text-base font-medium break-words">{movie.director}</p>
                </div>

                {movie.writers && movie.writers.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="flex items-center space-x-2 text-primary text-xs uppercase tracking-wider font-semibold">
                      <FileText size={14} className="shrink-0" />
                      <span>Writers / Screenplay</span>
                    </div>
                    <p className="text-white/90 text-xs sm:text-sm font-normal break-words">
                      {movie.writers.join(", ")}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
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

            {/* Detailed Film Facts & Heritage Grid */}
            <div className="p-4 sm:p-6 rounded-2xl bg-backgroundSecondary/40 border border-white/5 space-y-4">
              <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white font-heading flex items-center space-x-2">
                <Building2 size={15} className="text-primary" />
                <span>Film Details & Production Facts</span>
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 text-xs">
                <div className="min-w-0">
                  <span className="text-secondary-text block truncate">Original Language</span>
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
                  <span className="text-white font-medium block truncate">
                    {movie.runtime ? `${movie.runtime} min` : "Feature Film"}
                  </span>
                </div>
                {movie.productionCountry && (
                  <div className="min-w-0">
                    <span className="text-secondary-text block truncate">Country</span>
                    <span className="text-white font-medium block truncate">{movie.productionCountry}</span>
                  </div>
                )}
                {movie.ageRating && (
                  <div className="min-w-0">
                    <span className="text-secondary-text block truncate">Classification</span>
                    <span className="text-white font-medium block truncate">{movie.ageRating} Certificate</span>
                  </div>
                )}
                {movie.budget && (
                  <div className="min-w-0">
                    <span className="text-secondary-text block truncate">Budget</span>
                    <span className="text-white font-medium block truncate">{movie.budget}</span>
                  </div>
                )}
                {movie.boxOffice && (
                  <div className="min-w-0">
                    <span className="text-secondary-text block truncate">Box Office</span>
                    <span className="text-white font-medium block truncate">{movie.boxOffice}</span>
                  </div>
                )}
              </div>

              {movie.productionCompanies && movie.productionCompanies.length > 0 && (
                <div className="pt-2 border-t border-white/5 text-xs">
                  <span className="text-secondary-text block mb-1">Production Companies:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {movie.productionCompanies.map((comp) => (
                      <span key={comp} className="px-2 py-0.5 rounded bg-card text-white/80 border border-white/5">
                        {comp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {movie.awards && movie.awards.length > 0 && (
                <div className="pt-2 border-t border-white/5 text-xs space-y-1">
                  <span className="text-primary font-semibold flex items-center space-x-1.5">
                    <Award size={13} />
                    <span>Notable Accolades & Awards:</span>
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-secondary-text">
                    {movie.awards.map((award, idx) => (
                      <li key={idx} className="text-white/90">{award}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Movie Highlights / Trivia */}
            {movie.highlights && movie.highlights.length > 0 && (
              <div className="p-4 sm:p-6 rounded-2xl bg-card/60 border border-white/5 space-y-3">
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-white font-heading flex items-center space-x-2">
                  <Award size={15} className="text-primary" />
                  <span>Movie Highlights & Verified Trivia</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-secondary-text">
                  {movie.highlights.map((item, i) => (
                    <li key={i} className="flex items-start space-x-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                      <span className="leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 1. PLAY TRAILER SECTION (Prominently placed immediately BEFORE Where to Watch) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-2">
                <div className="w-1.5 h-5 bg-red-500 rounded-full" />
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  Official Trailer
                </h2>
              </div>

              {movie.trailerYoutubeId ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-red-600/15 via-card to-card border border-red-500/25 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg shadow-black/40">
                  <div className="flex items-center space-x-3.5">
                    <div className="w-12 h-12 rounded-xl bg-red-600/20 text-red-500 border border-red-500/30 flex items-center justify-center shrink-0 shadow-inner">
                      <Play size={22} className="fill-red-500 translate-x-0.5" />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-base sm:text-lg font-heading">
                        Watch Official Preview
                      </h3>
                      <p className="text-xs sm:text-sm text-secondary-text">
                        Official high-definition trailer for {movie.title} ({movie.releaseYear}) on YouTube
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setTrailerOpen(true)}
                    className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm shrink-0 transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-secondary/25 cursor-pointer"
                    aria-label={`Play trailer for ${movie.title}`}
                  >
                    <Play size={16} className="fill-white" />
                    <span>Play Trailer</span>
                  </button>
                </div>
              ) : (
                <div className="p-4 sm:p-5 rounded-2xl bg-card/40 border border-white/5 flex items-center space-x-3 text-secondary-text text-xs sm:text-sm">
                  <Film size={18} className="text-secondary-text/60 shrink-0" />
                  <span>Official preview trailer currently unavailable for this title.</span>
                </div>
              )}
            </div>

            {/* 2. Where to Watch Section */}
            <WhereToWatch watchOptions={movie.watchOptions} movieTitle={movie.title} />

            {/* Frequently Asked Questions (FAQ) Section */}
            {movie.faq && movie.faq.length > 0 && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-1.5 h-5 bg-primary rounded-full" />
                    <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight flex items-center space-x-2">
                      <span>Frequently Asked Questions</span>
                    </h2>
                  </div>
                  <p className="text-xs sm:text-sm text-secondary-text pl-3.5">
                    Essential answers about {movie.title}.
                  </p>
                </div>

                <div className="space-y-2.5 pl-0 sm:pl-3.5">
                  {movie.faq.map((item, idx) => (
                    <div
                      key={idx}
                      className="rounded-xl bg-card border border-white/5 overflow-hidden transition-colors"
                    >
                      <button
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-4 text-left flex items-center justify-between space-x-3 hover:bg-white/5 transition-colors cursor-pointer"
                        aria-expanded={openFaqIndex === idx}
                      >
                        <span className="text-xs sm:text-sm font-semibold text-white">
                          {item.question}
                        </span>
                        {openFaqIndex === idx ? (
                          <ChevronUp size={16} className="text-primary shrink-0" />
                        ) : (
                          <ChevronDown size={16} className="text-secondary-text shrink-0" />
                        )}
                      </button>
                      {openFaqIndex === idx && (
                        <div className="px-4 pb-4 pt-1 text-xs sm:text-sm text-secondary-text leading-relaxed border-t border-white/5">
                          {item.answer}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
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
