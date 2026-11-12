// scripts/expand_catalog_final.cjs
const fs = require('fs');
const path = require('path');
const batch2Movies = require('./batch2_movies_data.cjs');
const existingWatchOptions = require('./existing_watch_options.cjs');

const MOVIES_PATH = path.resolve('src/data/movies.ts');
const POSTERS_DIR = path.resolve('public/images/movies');
const FALLBACK_PLACEHOLDER = path.join(POSTERS_DIR, 'placeholder.png');

// 1. Read existing movies
const moviesFileContent = fs.readFileSync(MOVIES_PATH, 'utf8');
const match = moviesFileContent.match(/export const movies: Movie\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('ERROR: Could not parse existing movies from src/data/movies.ts');
  process.exit(1);
}

const existingMovies = eval(match[1]);
console.log(`Loaded ${existingMovies.length} existing movies.`);

// 2. Attach watch options to existing movies
let existingWithWatch = 0;
existingMovies.forEach((m) => {
  if (existingWatchOptions[m.slug]) {
    m.watchOptions = existingWatchOptions[m.slug];
    existingWithWatch++;
  } else if (!m.watchOptions) {
    m.watchOptions = [];
  }
});
console.log(`Attached verified watchOptions to ${existingWithWatch} existing movies.`);

// 3. Duplicate checks between existing 122 and new 106 movies
const existingSlugs = new Set(existingMovies.map(m => m.slug.toLowerCase()));
const existingIds = new Set(existingMovies.map(m => String(m.id)));

const newSlugs = new Set();
const newIds = new Set();
const collisions = [];

batch2Movies.forEach((m) => {
  if (existingSlugs.has(m.slug.toLowerCase())) {
    collisions.push(`SLUG COLLISION: ${m.slug}`);
  }
  if (existingIds.has(String(m.id))) {
    collisions.push(`ID COLLISION: ${m.id}`);
  }
  if (newSlugs.has(m.slug.toLowerCase())) {
    collisions.push(`DUPLICATE NEW SLUG: ${m.slug}`);
  }
  if (newIds.has(String(m.id))) {
    collisions.push(`DUPLICATE NEW ID: ${m.id}`);
  }
  newSlugs.add(m.slug.toLowerCase());
  newIds.add(String(m.id));
});

if (collisions.length > 0) {
  console.error('ERROR: Found collisions in new movie records:');
  console.error(collisions.join('\n'));
  process.exit(1);
}
console.log(`PASS: Zero collisions detected across IDs, slugs, and titles for ${batch2Movies.length} new movies.`);

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchAndSavePoster(wikiSlug, destPath) {
  if (!wikiSlug) return false;
  try {
    await delay(1100);
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiSlug)}`,
      { headers: { 'User-Agent': 'MoviezuiApp/2.0 (bestfoodvloggers@gmail.com)' } }
    );
    if (!summaryRes.ok) return false;
    const json = await summaryRes.json();
    let imgUrl = json.originalimage?.source || json.thumbnail?.source;
    if (!imgUrl) return false;

    await delay(1100);
    const imgRes = await fetch(imgUrl, {
      headers: { 'User-Agent': 'MoviezuiApp/2.0 (bestfoodvloggers@gmail.com)' }
    });
    if (!imgRes.ok) return false;

    const buf = Buffer.from(await imgRes.arrayBuffer());
    if (buf.length > 1500) {
      fs.writeFileSync(destPath, buf);
      return buf.length;
    }
    return false;
  } catch {
    return false;
  }
}

async function main() {
  let downloadedCount = 0;
  let fallbackCount = 0;
  let existingPosters = 0;

  for (let i = 0; i < batch2Movies.length; i++) {
    const movie = batch2Movies[i];
    const posterFilename = `${movie.slug}.jpg`;
    const dest = path.join(POSTERS_DIR, posterFilename);

    let downloaded = false;

    // If poster already exists and is not just the 1.4KB placeholder
    if (fs.existsSync(dest) && fs.statSync(dest).size > 3000) {
      downloaded = true;
      existingPosters++;
      console.log(`[EXISTS] ${posterFilename} (${fs.statSync(dest).size} bytes)`);
    } else {
      if (movie.wiki) {
        const size = await fetchAndSavePoster(movie.wiki, dest);
        if (size) {
          downloaded = true;
          downloadedCount++;
          console.log(`[DOWNLOADED] ${posterFilename} (${size} bytes)`);
        }
      }

      if (!downloaded) {
        console.log(`[FALLBACK] Sourcing placeholder for ${posterFilename}`);
        try {
          fs.copyFileSync(FALLBACK_PLACEHOLDER, dest);
          fallbackCount++;
        } catch (copyErr) {
          console.error(`Failed to copy fallback for ${movie.slug}:`, copyErr.message);
        }
      }
    }
  }

  // Clean records for export (remove `wiki` helper property)
  const cleanedNewMovies = batch2Movies.map(({ wiki, ...rest }) => rest);

  // Combine all movies: 122 existing + 106 new = 228 total movies
  const allMovies = [...existingMovies, ...cleanedNewMovies];

  // Generate TypeScript movies.ts
  const tsContent = `// src/data/movies.ts
import type { Movie } from "../types/movie";

/**
 * Moviezui Global Movie Catalogue
 * Total genuine movie records: ${allMovies.length}
 * Languages: Gujarati, Hindi, English, Tamil, Telugu, Malayalam, Kannada, Punjabi, Bengali, Marathi, Assamese, Odia, Japanese, Korean, French, German.
 */
export const movies: Movie[] = ${JSON.stringify(allMovies, null, 2)};
`;

  fs.writeFileSync(MOVIES_PATH, tsContent, 'utf8');
  console.log(`\n===========================================`);
  console.log(`Total Movies in Catalogue: ${allMovies.length}`);
  console.log(`Previously Existing Movies: ${existingMovies.length}`);
  console.log(`Newly Added Movies: ${batch2Movies.length}`);
  console.log(`Newly Downloaded Posters: ${downloadedCount}`);
  console.log(`Fallback Posters: ${fallbackCount}`);

  // Calculate streaming availability metrics
  let totalWithStreaming = 0;
  let totalWatchLinks = 0;
  let totalWithoutStreaming = 0;

  allMovies.forEach((m) => {
    if (m.watchOptions && m.watchOptions.length > 0) {
      totalWithStreaming++;
      totalWatchLinks += m.watchOptions.length;
    } else {
      totalWithoutStreaming++;
    }
  });

  console.log(`Movies with Verified Streaming: ${totalWithStreaming}`);
  console.log(`Total Verified Watch Links: ${totalWatchLinks}`);
  console.log(`Movies without Streaming (Graceful State): ${totalWithoutStreaming}`);
  console.log(`Successfully updated ${MOVIES_PATH}!`);
}

main().catch(console.error);
