// src/pages/Home.tsx
import { Link } from "react-router-dom";
import { Sparkles, Film, ArrowRight, Award, Compass } from "lucide-react";
import FeaturedMovie from "../components/movies/FeaturedMovie";
import MovieCard from "../components/movies/MovieCard";
import SectionHeading from "../components/movies/SectionHeading";
import { movies } from "../data/movies";
import { genreDetails } from "../data/genres";

export default function Home() {
  // Curate movie slices
  const featured = movies.filter((m) => m.featured).slice(0, 4);

  // Popular movies sorted by rating descending (null ratings at the end)
  const popular = [...movies]
    .sort((a, b) => (b.imdbRating ?? 0) - (a.imdbRating ?? 0))
    .slice(0, 8);

  // Recently added / released (by releaseYear and addedAt)
  const recentlyAdded = [...movies]
    .sort((a, b) => {
      if (b.releaseYear !== a.releaseYear) {
        return b.releaseYear - a.releaseYear;
      }
      return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime();
    })
    .slice(0, 8);

  // Top highlight movie for hero feature card
  const heroHighlight = movies.find((m) => m.slug === "interstellar") || movies.find((m) => m.slug === "dangal") || movies[0];

  return (
    <div className="space-y-16 pb-12">
      {/* Cinematic Hero Section */}
      <section className="relative min-h-[580px] md:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-white/5">
        {/* Cinematic gradient & lighting overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-backgroundSecondary/90 via-background/95 to-background z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-amber-500/15 via-transparent to-transparent z-10" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 md:py-24">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs md:text-sm font-medium mb-6 shadow-sm">
            <Sparkles size={14} className="fill-primary" />
            <span>Official Movie Discovery Destination</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold font-heading text-white tracking-tight leading-tight md:leading-none mb-6">
            Discover Movies From <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-amber-500">
              Around The World
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-secondary-text max-w-2xl mx-auto mb-8 font-light leading-relaxed">
            Explore an ever-growing collection of movies across languages, industries and genres. Discover cinema, explore stories and find your next favourite movie.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/movies"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-sm md:text-base transition-all duration-200 shadow-lg shadow-primary/20 hover:scale-105"
            >
              <Film size={18} />
              <span>Explore All Movies</span>
            </Link>
            <Link
              to="/genres"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-7 py-3.5 rounded-xl bg-card hover:bg-card/80 text-white font-medium text-sm md:text-base border border-white/10 hover:border-primary/40 transition-all duration-200"
            >
              <Compass size={18} className="text-primary" />
              <span>Browse Genres</span>
            </Link>
          </div>

          {/* Quick Highlight Feature Card */}
          <div className="mt-12 pt-8 border-t border-white/10 max-w-xl mx-auto flex items-center justify-between text-left bg-card/40 p-4 rounded-xl border border-white/5 backdrop-blur-sm">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary">
                <Award size={20} />
              </div>
              <div>
                <p className="text-xs text-secondary-text uppercase tracking-wider font-semibold">Featured Classic</p>
                <p className="text-sm font-bold text-white">{heroHighlight.title} ({heroHighlight.releaseYear})</p>
              </div>
            </div>
            <Link
              to={`/movie/${heroHighlight.slug}`}
              className="text-xs font-semibold text-primary hover:underline flex items-center space-x-1"
            >
              <span>View Details</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Highlights / Stats Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl bg-card/60 border border-white/5 shadow-md">
          <div className="text-center p-3">
            <div className="text-2xl md:text-3xl font-extrabold text-primary font-heading">200+</div>
            <div className="text-xs text-secondary-text mt-1">Curated Masterpieces</div>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <div className="text-2xl md:text-3xl font-extrabold text-primary font-heading">10+</div>
            <div className="text-xs text-secondary-text mt-1">Film Genres</div>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <div className="text-2xl md:text-3xl font-extrabold text-primary font-heading">9.0</div>
            <div className="text-xs text-secondary-text mt-1">Top Rated IMDb Score</div>
          </div>
          <div className="text-center p-3 border-l border-white/5">
            <div className="text-2xl md:text-3xl font-extrabold text-primary font-heading">15+</div>
            <div className="text-xs text-secondary-text mt-1">Languages & Industries</div>
          </div>
        </div>
      </section>

      {/* Featured Movies */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Featured Movies"
          subtitle="Critically acclaimed movies celebrated with global recognition and record-breaking box office runs."
          actionText="View all movies"
          actionTo="/movies"
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {featured.map((movie) => (
            <FeaturedMovie key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Popular Movies Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Popular Movies"
          subtitle="Highest rated audience favorites with unforgettable performances and storytelling."
          actionText="Explore all"
          actionTo="/movies?sort=rating"
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {popular.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Explore by Genre Section */}
      <section className="bg-backgroundSecondary/50 py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            title="Explore by Genre"
            subtitle="Browse cinema tailored to every mood, from laugh-out-loud comedies to heart-wrenching dramas and action epics."
            actionText="All genres"
            actionTo="/genres"
          />

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
            {genreDetails.map((genre) => {
              const count = movies.filter((m) => m.genres.includes(genre.name)).length;
              return (
                <Link
                  key={genre.slug}
                  to={`/movies?genre=${encodeURIComponent(genre.name)}`}
                  className={`group relative p-4 rounded-xl bg-gradient-to-br ${genre.color} bg-card border border-white/5 hover:border-primary/50 transition-all duration-300 shadow-sm flex flex-col justify-between`}
                >
                  <div>
                    <h3 className="font-heading font-semibold text-white group-hover:text-primary transition-colors text-base mb-1">
                      {genre.name}
                    </h3>
                    <p className="text-[11px] text-secondary-text line-clamp-2">
                      {genre.description}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-[11px] text-secondary-text border-t border-white/5 pt-2">
                    <span className="text-primary font-medium">{count} Movies</span>
                    <ArrowRight size={12} className="text-secondary-text group-hover:text-primary transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Recently Added / Released Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          title="Recently Added & New Releases"
          subtitle="The latest arrivals and recent releases in our curated movie collection."
          actionText="View all new"
          actionTo="/movies?sort=newest"
        />
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {recentlyAdded.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </div>
  );
}
