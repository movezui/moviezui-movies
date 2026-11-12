// src/pages/Movies.tsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, X, ArrowUpDown, SlidersHorizontal, Film, Globe } from "lucide-react";
import MovieGrid from "../components/movies/MovieGrid";
import { movies } from "../data/movies";
import { genres } from "../data/genres";
import SEO from "../components/common/SEO";
import { createBreadcrumbSchema } from "../utils/schema";

export default function Movies() {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state synchronization
  const initialSearch = searchParams.get("search") || "";
  const initialLanguage = searchParams.get("language") || "";
  const initialGenre = searchParams.get("genre") || "";
  const initialYear = searchParams.get("year") ? Number(searchParams.get("year")) : undefined;
  const initialSort = searchParams.get("sort") || "newest";

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [selectedGenre, setSelectedGenre] = useState(initialGenre);
  const [selectedYear, setSelectedYear] = useState<number | undefined>(initialYear);
  const [sortOption, setSortOption] = useState(initialSort);

  // Pagination state: initially display 15 movies
  const PAGE_SIZE = 15;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Reset pagination when search query, filters, or sort change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, selectedLanguage, selectedGenre, selectedYear, sortOption]);

  // Sync state if URL changes externally
  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
    setSelectedLanguage(searchParams.get("language") || "");
    setSelectedGenre(searchParams.get("genre") || "");
    const y = searchParams.get("year");
    setSelectedYear(y ? Number(y) : undefined);
    setSortOption(searchParams.get("sort") || "newest");
  }, [searchParams]);

  // Available unique languages from dataset
  const availableLanguages = useMemo(() => {
    const langs = Array.from(new Set(movies.map((m) => m.language)));
    return langs.sort();
  }, []);

  // Available unique years from dataset
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(movies.map((m) => m.releaseYear)));
    return years.sort((a, b) => b - a);
  }, []);

  // Filtered and sorted movies
  const filteredMovies = useMemo(() => {
    let list = [...movies];

    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          m.director.toLowerCase().includes(q) ||
          m.language.toLowerCase().includes(q) ||
          (m.industry && m.industry.toLowerCase().includes(q)) ||
          m.cast.some((c) => c.toLowerCase().includes(q)) ||
          m.description.toLowerCase().includes(q)
      );
    }

    if (selectedLanguage) {
      list = list.filter((m) => m.language.toLowerCase() === selectedLanguage.toLowerCase());
    }

    if (selectedGenre) {
      list = list.filter((m) => m.genres.includes(selectedGenre));
    }

    if (selectedYear) {
      list = list.filter((m) => m.releaseYear === selectedYear);
    }

    if (sortOption === "newest") {
      list.sort((a, b) => b.releaseYear - a.releaseYear);
    } else if (sortOption === "oldest") {
      list.sort((a, b) => a.releaseYear - b.releaseYear);
    } else if (sortOption === "rating") {
      list.sort((a, b) => (b.imdbRating ?? 0) - (a.imdbRating ?? 0));
    } else if (sortOption === "title") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    }

    return list;
  }, [searchTerm, selectedLanguage, selectedGenre, selectedYear, sortOption]);

  // Paginated visible slice of filtered movies
  const visibleMovies = useMemo(() => {
    return filteredMovies.slice(0, visibleCount);
  }, [filteredMovies, visibleCount]);

  const updateParam = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    updateParam("search", val || undefined);
  };

  const handleLanguageChange = (val: string) => {
    setSelectedLanguage(val);
    updateParam("language", val || undefined);
  };

  const handleGenreChange = (val: string) => {
    setSelectedGenre(val);
    updateParam("genre", val || undefined);
  };

  const handleYearChange = (val: number | undefined) => {
    setSelectedYear(val);
    updateParam("year", val ? String(val) : undefined);
  };

  const handleSortChange = (val: string) => {
    setSortOption(val);
    updateParam("sort", val || undefined);
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedLanguage("");
    setSelectedGenre("");
    setSelectedYear(undefined);
    setSortOption("newest");
    setSearchParams(new URLSearchParams());
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedLanguage || selectedGenre || selectedYear || (sortOption && sortOption !== "newest")
  );

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "All Movies", path: "/movies" },
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <SEO
        title="All Movies – Browse Complete World Cinema Catalog"
        description="Search, filter, and discover movies across Bollywood, Hollywood, Gujarati, South Indian, and regional cinema. Find verified Where to Watch streaming options."
        canonicalPath="/movies"
        schema={breadcrumbSchema}
      />
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-6 bg-primary rounded-full" />
            <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
              All Movies
            </h1>
          </div>
          <p className="mt-2 text-sm text-secondary-text max-w-2xl pl-3.5">
            Explore our curated global catalogue of cinema from across industries and languages. Filter by language, genre, release year, or search by title, cast, and director.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-sm text-secondary-text pl-3.5 md:pl-0">
          <span className="px-3 py-1 rounded-full bg-card border border-white/10 text-white font-semibold">
            {filteredMovies.length === 0
              ? "0 Movies"
              : `Showing ${Math.min(visibleCount, filteredMovies.length)} of ${filteredMovies.length} Movies`}
          </span>
        </div>
      </div>

      {/* Control Bar: Search & Filters */}
      <div className="bg-card/70 border border-white/10 p-4 md:p-6 rounded-2xl shadow-lg space-y-4">
        {/* Search Input Row */}
        <div className="relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          <input
            type="text"
            placeholder="Search by movie title, director, cast member, industry..."
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-11 pr-10 py-3 rounded-xl bg-backgroundSecondary text-white placeholder-secondary-text border border-white/10 focus:outline-none focus:border-primary text-sm transition"
          />
          {searchTerm && (
            <button
              onClick={() => handleSearchChange("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text hover:text-white"
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Language select */}
          <div className="relative">
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white border border-white/10 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="">All Languages ({availableLanguages.length})</option>
              {availableLanguages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <Globe size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          </div>

          {/* Genre select */}
          <div className="relative">
            <select
              value={selectedGenre}
              onChange={(e) => handleGenreChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white border border-white/10 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="">All Genres ({genres.length})</option>
              {genres.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
            <Filter size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          </div>

          {/* Year select */}
          <div className="relative">
            <select
              value={selectedYear || ""}
              onChange={(e) => handleYearChange(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white border border-white/10 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="">All Release Years</option>
              {availableYears.map((yr) => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
            <SlidersHorizontal size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          </div>

          {/* Sort Option */}
          <div className="relative">
            <select
              value={sortOption}
              onChange={(e) => handleSortChange(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white border border-white/10 text-sm focus:outline-none focus:border-primary appearance-none cursor-pointer"
            >
              <option value="newest">Newest Releases First</option>
              <option value="oldest">Oldest Releases First</option>
              <option value="rating">Highest IMDb Rating</option>
              <option value="title">Alphabetical (A-Z)</option>
            </select>
            <ArrowUpDown size={14} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none" />
          </div>

          {/* Reset button */}
          <div>
            <button
              onClick={handleClearAll}
              disabled={!hasActiveFilters}
              className={`w-full py-2.5 px-4 rounded-xl text-sm font-semibold transition border ${
                hasActiveFilters
                  ? "bg-secondary/10 border-secondary/30 text-secondary hover:bg-secondary/20 cursor-pointer"
                  : "bg-white/5 border-white/5 text-secondary-text/40 cursor-not-allowed"
              }`}
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Active Filter Badges */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 text-xs text-secondary-text">
            <span>Active filters:</span>
            {searchTerm && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <span>Query: &quot;{searchTerm}&quot;</span>
                <button onClick={() => handleSearchChange("")} aria-label="Remove search filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedLanguage && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <span>Language: {selectedLanguage}</span>
                <button onClick={() => handleLanguageChange("")} aria-label="Remove language filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedGenre && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <span>Genre: {selectedGenre}</span>
                <button onClick={() => handleGenreChange("")} aria-label="Remove genre filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {selectedYear && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                <span>Year: {selectedYear}</span>
                <button onClick={() => handleYearChange(undefined)} aria-label="Remove year filter">
                  <X size={12} />
                </button>
              </span>
            )}
            {sortOption && sortOption !== "newest" && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/10 text-white border border-white/10">
                <span>Sorted by: {sortOption}</span>
                <button onClick={() => handleSortChange("newest")} aria-label="Reset sort">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Movie Grid or Empty State */}
      {filteredMovies.length > 0 ? (
        <div className="space-y-8">
          <MovieGrid movies={visibleMovies} />

          {/* Load More Button */}
          {visibleCount < filteredMovies.length && (
            <div className="pt-4 pb-2 flex flex-col items-center justify-center space-y-3">
              <button
                onClick={() => setVisibleCount((prev) => prev + PAGE_SIZE)}
                className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-sm transition-all duration-200 shadow-lg shadow-primary/20 hover:scale-105 cursor-pointer"
              >
                <span>Load More Movies</span>
              </button>
              <p className="text-xs text-secondary-text font-medium">
                Showing {Math.min(visibleCount, filteredMovies.length)} of {filteredMovies.length} movies
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="py-20 text-center bg-card/40 rounded-2xl border border-white/5 p-8 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-secondary-text">
            <Film size={28} />
          </div>
          <h3 className="text-xl font-bold font-heading text-white">No movies found</h3>
          <p className="text-sm text-secondary-text leading-relaxed">
            We couldn&apos;t find any movies matching your current search or filter criteria. Try adjusting your query or resetting filters.
          </p>
          <button
            onClick={handleClearAll}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-primary text-background font-semibold text-sm hover:bg-primary/90 transition shadow"
          >
            <span>Reset All Filters</span>
          </button>
        </div>
      )}
    </div>
  );
}
