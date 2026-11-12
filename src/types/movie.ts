// src/types/movie.ts
export interface WatchOption {
  platform: string;
  url: string;
  type: "subscription" | "rent" | "buy" | "free";
  region?: string;
  verified?: boolean;
  lastVerified?: string;
}

export interface Movie {
  id: string; // unique id
  slug: string; // URL-friendly slug, e.g. "hellaro"
  title: string; // displayed title
  originalTitle?: string; // if different
  releaseYear: number;
  language: string; // e.g. "Gujarati", "Hindi", "English", "Tamil", "Telugu", etc.
  industry: string; // e.g. "Gujarati Cinema", "Bollywood", "Hollywood", etc.
  genres: string[]; // e.g. ["Drama", "Historical"]
  director: string;
  cast: string[]; // main cast names
  description: string; // short synopsis
  poster: string; // relative path in public/images/movies/
  backdrop?: string; // optional larger image
  imdbRating: number | null; // 0‑10 scale or null (no external link)
  runtime?: number; // minutes
  featured: boolean; // highlight on home page
  addedAt: string; // ISO timestamp when added to dataset
  sources?: string[]; // URLs for verification
  watchOptions?: WatchOption[];
}
