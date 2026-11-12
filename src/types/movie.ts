// src/types/movie.ts

export interface WatchOption {
  platform: string;
  url: string;
  type: "subscription" | "rent" | "buy" | "free";
  region?: string;
  verified?: boolean;
  lastVerified?: string;
}

export interface MovieFAQ {
  question: string;
  answer: string;
}

export interface Movie {
  id: string; // unique id
  slug: string; // URL-friendly slug, e.g. "hellaro"
  title: string; // displayed title
  originalTitle?: string; // native language script or alternate title
  releaseYear: number;
  releaseDate?: string; // full theatrical release date, e.g. "8 November 2019"
  language: string; // e.g. "Gujarati", "Hindi", "English", "Tamil", "Telugu", etc.
  industry: string; // e.g. "Gujarati Cinema", "Bollywood", "Hollywood", etc.
  genres: string[]; // e.g. ["Drama", "Historical"]
  director: string;
  writers?: string[]; // screenwriters / story writers
  cast: string[]; // main cast names
  description: string; // expanded synopsis (approx 100-180 words)
  tagline?: string; // official movie tagline
  poster: string; // relative path in public/images/movies/
  backdrop?: string; // optional larger backdrop image
  imdbRating: number | null; // 0‑10 scale or null
  runtime?: number; // minutes
  ageRating?: string; // e.g. "U", "UA", "A", "PG-13", "R"
  productionCountry?: string; // e.g. "India", "United States", "United Kingdom"
  productionCompanies?: string[]; // e.g. ["Aamir Khan Productions", "UTV Motion Pictures"]
  budget?: string; // e.g. "₹70 Crore", "$165 Million"
  boxOffice?: string; // e.g. "₹2,024 Crore", "$731 Million"
  filmingLocations?: string; // e.g. "Kutch, Gujarat, India"
  awards?: string[]; // notable verified awards
  worthWatching?: string; // concise editorial explanation of why it's worth watching
  highlights?: string[]; // 2-4 interesting verified facts/highlights
  faq?: MovieFAQ[]; // 2-3 genuine movie-specific Q&As
  featured: boolean; // highlight on home page
  addedAt: string; // ISO timestamp when added to dataset
  sources?: string[]; // URLs for verification
  watchOptions?: WatchOption[];
  trailerYoutubeId?: string; // official YouTube video ID, e.g. "x_7YlGv9u1g"
}
