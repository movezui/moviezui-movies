// scripts/audit_movies.cjs
const fs = require("fs");
const path = require("path");

const moviesFilePath = path.join(__dirname, "../src/data/movies.ts");
const rawContent = fs.readFileSync(moviesFilePath, "utf-8");

// Extract the raw movies array
const movies = eval(rawContent.replace(/import type[\s\S]*?export const movies: Movie\[\] =/, ''));
console.log(`Loaded ${movies.length} movies.`);

const summaryByLang = {};
movies.forEach((m, idx) => {
  summaryByLang[m.language] = (summaryByLang[m.language] || 0) + 1;
});
console.log("Movies by language:", summaryByLang);

// Output the full list with index
const list = movies.map((m, idx) => ({
  idx: idx + 1,
  id: m.id,
  slug: m.slug,
  title: m.title,
  releaseYear: m.releaseYear,
  language: m.language,
  industry: m.industry,
  director: m.director,
  currentTrailer: m.trailerYoutubeId || null,
}));

fs.writeFileSync(path.join(__dirname, "movies_list.json"), JSON.stringify(list, null, 2));
console.log("Wrote scripts/movies_list.json with 228 movies.");
