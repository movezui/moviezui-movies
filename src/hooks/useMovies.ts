// src/hooks/useMovies.ts
import { useState, useMemo } from "react";
import type { Movie } from "../types/movie";

export function useMovies(initialMovies: Movie[]) {
  const [search, setSearch] = useState<string>("");
  const [genre, setGenre] = useState<string>("");
  const [year, setYear] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState<string>("");

  const filteredMovies = useMemo(() => {
    let result = initialMovies;
    if (search) {
      const term = search.toLowerCase();
      result = result.filter((m) => m.title.toLowerCase().includes(term));
    }
    if (genre) {
      result = result.filter((m) => m.genres.includes(genre));
    }
    if (year) {
      result = result.filter((m) => m.releaseYear === year);
    }
    if (sort) {
      if (sort === "newest") {
        result = [...result].sort((a, b) => b.releaseYear - a.releaseYear);
      } else if (sort === "oldest") {
        result = [...result].sort((a, b) => a.releaseYear - b.releaseYear);
      } else if (sort === "rating") {
        result = [...result].sort((a, b) => {
          const ra = a.imdbRating ?? 0;
          const rb = b.imdbRating ?? 0;
          return rb - ra;
        });
      }
    }
    return result;
  }, [initialMovies, search, genre, year, sort]);

  const availableGenres = useMemo(() => {
    const set = new Set<string>();
    initialMovies.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return Array.from(set).sort();
  }, [initialMovies]);

  const availableYears = useMemo(() => {
    const set = new Set<number>();
    initialMovies.forEach((m) => set.add(m.releaseYear));
    return Array.from(set).sort((a, b) => b - a);
  }, [initialMovies]);

  return {
    filteredMovies,
    setSearch,
    setGenre,
    setYear,
    setSort,
    clearFilters: () => {
      setSearch("");
      setGenre("");
      setYear(undefined);
      setSort("");
    },
    availableGenres,
    availableYears,
  };
}
