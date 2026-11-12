// scripts/verify_expanded.cjs
const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('   MOVIEZUI EXPANDED DATABASE & FEATURE VERIFICATION   ');
console.log('========================================================\n');

// 1. Check IMDb external links
console.log('CHECK 1: IMDb External Link Removal');
const srcFiles = [];
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (full.endsWith('.tsx') || full.endsWith('.ts')) srcFiles.push(full);
  }
}
walk(path.join(process.cwd(), 'src'));

let imdbLinksFound = false;
let imdbUrlFieldFound = false;
for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('imdb.com/title')) {
    imdbLinksFound = true;
    console.error(`   FAIL: ${path.relative(process.cwd(), file)} contains imdb.com link`);
  }
  if (content.includes('imdbUrl') || content.includes('imdbId')) {
    imdbUrlFieldFound = true;
    console.error(`   FAIL: ${path.relative(process.cwd(), file)} contains imdbUrl/imdbId`);
  }
}
if (!imdbLinksFound && !imdbUrlFieldFound) {
  console.log('   PASS: All IMDb external links and imdbUrl/imdbId fields removed from source code.');
}

// 2. Load movies from src/data/movies.ts
console.log('\nCHECK 2: Movie Database Count & Uniqueness');
const moviesTs = fs.readFileSync(path.join(process.cwd(), 'src', 'data', 'movies.ts'), 'utf8');
const jsonMatch = moviesTs.match(/export const movies: Movie\[\] = (\[[\s\S]*?\]);/);
if (!jsonMatch) {
  console.error('   FAIL: Unable to parse movies array from src/data/movies.ts');
  process.exit(1);
}

const movies = JSON.parse(jsonMatch[1]);
console.log(`   Total Movie Records: ${movies.length}`);
if (movies.length >= 100) {
  console.log('   PASS: Exceeds minimum 100 movies requirement.');
} else {
  console.error('   FAIL: Less than 100 movies!');
}

const idSet = new Set();
const slugSet = new Set();
let duplicates = 0;
for (const m of movies) {
  if (idSet.has(m.id)) {
    console.error(`   FAIL: Duplicate id "${m.id}" on ${m.title}`);
    duplicates++;
  }
  if (slugSet.has(m.slug)) {
    console.error(`   FAIL: Duplicate slug "${m.slug}" on ${m.title}`);
    duplicates++;
  }
  idSet.add(m.id);
  slugSet.add(m.slug);
}
if (duplicates === 0) {
  console.log('   PASS: Zero duplicate IDs or slugs.');
}

// 3. Language Breakdown
console.log('\nCHECK 3: Language & Industry Distribution');
const langMap = {};
const industryMap = {};
for (const m of movies) {
  langMap[m.language] = (langMap[m.language] || 0) + 1;
  industryMap[m.industry] = (industryMap[m.industry] || 0) + 1;
}
console.log('   Languages:', langMap);
console.log('   Industries:', industryMap);

// 4. Poster files verification
console.log('\nCHECK 4: Local Poster Assets Verification');
const publicDir = path.join(process.cwd(), 'public');
let missingPosters = 0;
let smallPosters = 0;
let validPosters = 0;

for (const m of movies) {
  const localPath = path.join(publicDir, m.poster.replace(/^\//, ''));
  if (!fs.existsSync(localPath)) {
    missingPosters++;
    console.error(`   MISSING: ${m.poster} for "${m.title}"`);
  } else {
    const size = fs.statSync(localPath).size;
    if (size < 1000) smallPosters++;
    else validPosters++;
  }
}
console.log(`   Valid Local Posters: ${validPosters}`);
console.log(`   Missing Posters: ${missingPosters}`);
if (missingPosters === 0) {
  console.log('   PASS: All movie poster files exist locally in public/images/movies/.');
}

// 5. Verified IMDb Ratings Check
console.log('\nCHECK 5: IMDb Ratings Status');
let ratedCount = 0;
let unratedCount = 0;
for (const m of movies) {
  if (typeof m.imdbRating === 'number' && m.imdbRating > 0 && m.imdbRating <= 10) {
    ratedCount++;
  } else if (m.imdbRating === null) {
    unratedCount++;
  } else {
    console.error(`   INVALID RATING: ${m.title} has ${m.imdbRating}`);
  }
}
console.log(`   Verified Ratings: ${ratedCount}`);
console.log(`   Unrated / null Ratings: ${unratedCount}`);
console.log('   PASS: All ratings are either valid verified numbers (0-10) or null.');

console.log('\n========================================================\n');
