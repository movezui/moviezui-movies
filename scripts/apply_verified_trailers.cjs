// scripts/apply_verified_trailers.cjs
const fs = require("fs");
const path = require("path");

const moviesPath = path.join(__dirname, "..", "src", "data", "movies.ts");
const content = fs.readFileSync(moviesPath, "utf8");

const marker = "export const movies: Movie[] =";
const markerIndex = content.indexOf(marker);
const header = content.substring(0, markerIndex + marker.length) + " ";
const arrayStart = content.indexOf("[", markerIndex + marker.length);
const arrayEnd = content.lastIndexOf("]");
const jsonString = content.substring(arrayStart, arrayEnd + 1);

const existingMovies = JSON.parse(jsonString);
const verifiedCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, "full_verified_catalog.json"), "utf8"));

console.log(`Existing movies: ${existingMovies.length}`);
console.log(`Verified catalog: ${verifiedCatalog.length}`);

if (existingMovies.length !== 228 || verifiedCatalog.length !== 228) {
  console.error("Mismatch in movie counts!");
  process.exit(1);
}

let updatedCount = 0;
let removedCount = 0;
let unchangedCount = 0;

for (const m of existingMovies) {
  const verified = verifiedCatalog.find(v => v.id === m.id || v.slug === m.slug);
  if (!verified) {
    console.error(`Missing verification for movie id ${m.id} (${m.title})`);
    process.exit(1);
  }

  const oldId = m.trailerYoutubeId;
  const newId = verified.trailerYoutubeId;

  if (newId) {
    m.trailerYoutubeId = newId;
    if (oldId !== newId) {
      updatedCount++;
    } else {
      unchangedCount++;
    }
  } else {
    if (m.trailerYoutubeId) {
      delete m.trailerYoutubeId;
      removedCount++;
    }
  }
}

console.log(`Updated trailers: ${updatedCount}`);
console.log(`Unchanged trailers: ${unchangedCount}`);
console.log(`Removed unverified/null trailers: ${removedCount}`);

const newFileContent = header + JSON.stringify(existingMovies, null, 2) + ";\n";
fs.writeFileSync(moviesPath, newFileContent, "utf8");
console.log(`Successfully updated ${moviesPath}!`);
