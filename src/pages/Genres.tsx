// src/pages/Genres.tsx
import { useSearchParams, Link } from "react-router-dom";
import { ArrowRight, Compass, Filter } from "lucide-react";
import MovieGrid from "../components/movies/MovieGrid";
import { movies } from "../data/movies";
import { genreDetails, genres } from "../data/genres";
import SEO from "../components/common/SEO";
import { createBreadcrumbSchema } from "../utils/schema";

export default function Genres() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeGenre = searchParams.get("genre") || "";

  const handleSelectGenre = (genre: string) => {
    if (genre) {
      setSearchParams({ genre });
    } else {
      setSearchParams({});
    }
  };

  const filteredMovies = activeGenre
    ? movies.filter((m) => m.genres.includes(activeGenre))
    : [];

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Genres", path: "/genres" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <SEO
        title={activeGenre ? `${activeGenre} Movies – Discover Top ${activeGenre} Cinema` : "Browse Movies by Genre – Drama, Action, Comedy & More"}
        description={
          activeGenre
            ? `Discover verified ${activeGenre} movies across languages and industries. Find plot summaries, cast lists, and Where to Watch streaming options.`
            : "Explore 17+ film genres on Moviezui. Find movies in Drama, Comedy, Action, Thriller, Sci-Fi, Romance, Crime, and regional storytelling traditions."
        }
        canonicalPath="/genres"
        schema={breadcrumbSchema}
      />
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-6 bg-primary rounded-full" />
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
            {activeGenre ? `Genre: ${activeGenre}` : "Explore Cinema by Genre"}
          </h1>
        </div>
        <p className="mt-2 text-sm text-secondary-text max-w-2xl pl-3.5">
          {activeGenre
            ? `Discover all curated movies classified under the ${activeGenre} genre.`
            : "Explore diverse storytelling genres—from heart-wrenching period sagas and rural folklore to high-energy comedies, sci-fi adventures, and modern thrillers."}
        </p>
      </div>

      {/* Genre Pills Navigation */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => handleSelectGenre("")}
          className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border ${
            !activeGenre
              ? "bg-primary text-background border-primary"
              : "bg-card text-secondary-text border-white/10 hover:text-white hover:border-white/20"
          }`}
        >
          All Genres ({genreDetails.length})
        </button>
        {genres.map((g) => {
          const count = movies.filter((m) => m.genres.includes(g)).length;
          const isSelected = activeGenre === g;
          return (
            <button
              key={g}
              onClick={() => handleSelectGenre(g)}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition border flex items-center space-x-1.5 ${
                isSelected
                  ? "bg-primary text-background border-primary font-bold shadow-md shadow-primary/10"
                  : "bg-card text-secondary-text border-white/10 hover:text-white hover:border-white/20"
              }`}
            >
              <span>{g}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? "bg-black/20 text-background" : "bg-white/10 text-secondary-text"}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* When a specific genre is chosen */}
      {activeGenre ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-card/40 p-4 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2 text-sm text-secondary-text">
              <Filter size={16} className="text-primary" />
              <span>
                Found <strong className="text-white">{filteredMovies.length}</strong> movies in{" "}
                <strong className="text-primary">{activeGenre}</strong>
              </span>
            </div>
            <button
              onClick={() => handleSelectGenre("")}
              className="text-xs text-primary hover:underline font-medium"
            >
              Clear genre filter
            </button>
          </div>

          <MovieGrid
            movies={filteredMovies}
            emptyMessage={`No movies found under the ${activeGenre} genre yet.`}
          />
        </div>
      ) : (
        /* When browsing all genres */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {genreDetails.map((item) => {
            const genreMovies = movies.filter((m) => m.genres.includes(item.name));
            return (
              <div
                key={item.slug}
                className={`group relative p-6 rounded-2xl bg-card border border-white/10 hover:border-primary/50 transition-all duration-300 shadow-lg flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                      {genreMovies.length} {genreMovies.length === 1 ? "Movie" : "Movies"}
                    </span>
                    <Compass size={18} className="text-primary/60 group-hover:text-primary transition" />
                  </div>

                  <h2 className="text-2xl font-bold font-heading text-white group-hover:text-primary transition-colors mb-2">
                    {item.name}
                  </h2>

                  <p className="text-sm text-secondary-text leading-relaxed mb-6 font-light">
                    {item.description}
                  </p>

                  {/* Sample movies list in this genre */}
                  <div className="space-y-1.5 mb-6 pt-4 border-t border-white/5">
                    <span className="text-[11px] uppercase tracking-wider text-secondary-text/70 font-semibold block">
                      Notable Titles:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {genreMovies.slice(0, 3).map((m) => (
                        <Link
                          key={m.id}
                          to={`/movie/${m.slug}`}
                          className="text-xs text-white/90 bg-backgroundSecondary px-2.5 py-1 rounded-md border border-white/5 hover:border-primary/30 hover:text-primary transition"
                        >
                          {m.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <button
                    onClick={() => handleSelectGenre(item.name)}
                    className="w-full inline-flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-white/5 hover:bg-primary hover:text-background text-white font-semibold text-xs transition border border-white/10 hover:border-primary"
                  >
                    <span>View All {item.name} Films</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
