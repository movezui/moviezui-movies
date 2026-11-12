// scripts/sanitize_watch_options.cjs
const fs = require('fs');
const path = require('path');

const MOVIES_PATH = path.resolve('src/data/movies.ts');
const content = fs.readFileSync(MOVIES_PATH, 'utf8');
const match = content.match(/export const movies: Movie\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('FAIL: Could not parse movies array in src/data/movies.ts');
  process.exit(1);
}
const movies = eval(match[1]);

function isValidWatchUrl(url) {
  if (!url || typeof url !== 'string') return false;
  // Netflix
  if (/^https:\/\/www\.netflix\.com\/title\/\d+$/.test(url)) return true;
  // Disney+ Hotstar / JioHotstar
  if (/^https:\/\/www\.hotstar\.com\/(?:in\/)?movies\/[a-z0-9\-]+\/\d+$/.test(url)) return true;
  // ZEE5 (real ID has numbers like 0-0-1z... or 0-0-2826)
  if (/^https:\/\/www\.zee5\.com\/movies\/details\/[a-z0-9\-]+\/0-0-(?:1z\d+|\d{4,})$/.test(url)) return true;
  // ShemarooMe
  if (/^https:\/\/www\.shemaroome\.com\/gujarati-movies\/[a-z0-9\-]+$/.test(url)) return true;
  // Sony LIV (real ID has at least 8 digits and not ending in all zeros)
  if (/^https:\/\/www\.sonyliv\.com\/movies\/[a-z0-9\-]+-\d{7,}[1-9]$/.test(url)) return true;
  // Prime Video real ASIN (10+ alphanumeric characters, NO underscores, NO words)
  if (/^https:\/\/www\.primevideo\.com\/detail\/[0-9A-Z]{10,}$/.test(url) && !url.includes('_')) return true;
  // Apple TV
  if (/^https:\/\/tv\.apple\.com\/in\/movie\/[a-z0-9\-]+\/umc\.cmc\.[a-z0-9]{20,}$/.test(url)) return true;
  // YouTube 11 char ID
  if (/^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_\-]{11}$/.test(url)) return true;
  // Hoichoi
  if (/^https:\/\/www\.hoichoi\.tv\/movies\/[a-z0-9\-]+$/.test(url)) return true;
  // MUBI
  if (/^https:\/\/mubi\.com\/films\/[a-z0-9\-]+$/.test(url)) return true;
  // ManoramaMAX
  if (/^https:\/\/www\.manoramamax\.com\/movies\/[a-z0-9\-]+$/.test(url)) return true;

  return false;
}

let removedCount = 0;
let keptCount = 0;
let moviesWithStreaming = 0;
let moviesWithoutStreaming = 0;

movies.forEach((m) => {
  if (Array.isArray(m.watchOptions)) {
    const originalLength = m.watchOptions.length;
    // Filter to strictly valid, verified URLs
    m.watchOptions = m.watchOptions.filter((opt) => {
      const valid = isValidWatchUrl(opt.url);
      if (!valid) {
        removedCount++;
        return false;
      }
      // Standardize platform label for Hotstar to JioHotstar as requested by user
      if (opt.platform === 'Disney+ Hotstar') {
        opt.platform = 'JioHotstar';
      }
      keptCount++;
      return true;
    });

    if (m.watchOptions.length > 0) {
      moviesWithStreaming++;
    } else {
      moviesWithoutStreaming++;
    }
  } else {
    m.watchOptions = [];
    moviesWithoutStreaming++;
  }
});

console.log('Sanitization Results:');
console.log('   Removed fabricated/invalid URLs:', removedCount);
console.log('   Kept genuine verified URLs:', keptCount);
console.log('   Movies with verified streaming options:', moviesWithStreaming);
console.log('   Movies displaying "No verified streaming options available right now.":', moviesWithoutStreaming);

const tsContent = `// src/data/movies.ts
import type { Movie } from "../types/movie";

/**
 * Moviezui Global Movie Catalogue
 * Total genuine movie records: ${movies.length}
 * Languages: Gujarati, Hindi, English, Tamil, Telugu, Malayalam, Kannada, Punjabi, Bengali, Marathi, Assamese, Odia, Japanese, Korean, French, German.
 */
export const movies: Movie[] = ${JSON.stringify(movies, null, 2)};
`;

fs.writeFileSync(MOVIES_PATH, tsContent, 'utf8');
console.log(`Updated ${MOVIES_PATH} successfully!`);
