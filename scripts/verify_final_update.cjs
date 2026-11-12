// scripts/verify_final_update.cjs
const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('   MOVIEZUI FINAL DEVELOPMENT UPDATE VERIFICATION       ');
console.log('========================================================\n');

// 1. Read movies.ts
const content = fs.readFileSync('src/data/movies.ts', 'utf8');
const match = content.match(/export const movies: Movie\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('FAIL: Could not parse movies array in src/data/movies.ts');
  process.exit(1);
}
const movies = eval(match[1]);

// Check 1: Count & Preservation of original 122
console.log('CHECK 1: Database Size & Original 122 Preservation');
console.log(`   Total Movie Count: ${movies.length}`);
if (movies.length < 222) {
  console.error(`FAIL: Total count ${movies.length} is less than required 222.`);
  process.exit(1);
}
console.log('   PASS: Exceeds 222+ total movies requirement.');

const existingList = fs.readFileSync('scripts/existing_list.txt', 'utf8').split('\n').filter(Boolean);
const original122Slugs = existingList.map(line => line.split('|')[0].trim());
let preservedCount = 0;
original122Slugs.forEach(slug => {
  if (movies.some(m => m.slug === slug)) preservedCount++;
});
console.log(`   Preserved Original Movies: ${preservedCount} / ${original122Slugs.length}`);
if (preservedCount !== 122) {
  console.error('FAIL: Original 122 movies were not completely preserved!');
  process.exit(1);
}
console.log('   PASS: 100% of the original 122 movies are preserved.');

// Check 2: Newly Added Count
const newAdditionsCount = movies.length - 122;
console.log(`\nCHECK 2: New Movie Additions Count: ${newAdditionsCount}`);
if (newAdditionsCount < 100) {
  console.error('FAIL: Less than 100 new movies were added!');
  process.exit(1);
}
console.log('   PASS: Added at least 100 new movies (achieved ' + newAdditionsCount + ').');

// Check 3: Uniqueness (IDs and Slugs)
console.log('\nCHECK 3: Uniqueness Verification');
const idSet = new Set();
const slugSet = new Set();
let duplicatesFound = false;

movies.forEach(m => {
  if (idSet.has(m.id)) {
    console.error(`FAIL: Duplicate ID found: ${m.id}`);
    duplicatesFound = true;
  }
  if (slugSet.has(m.slug)) {
    console.error(`FAIL: Duplicate Slug found: ${m.slug}`);
    duplicatesFound = true;
  }
  idSet.add(m.id);
  slugSet.add(m.slug);
});

if (duplicatesFound) {
  process.exit(1);
}
console.log(`   PASS: Exactly ${idSet.size} unique IDs and ${slugSet.size} unique slugs.`);

// Check 4: Poster Asset Existence
console.log('\nCHECK 4: Local Poster Assets Check');
let missingPosters = 0;
movies.forEach(m => {
  const localFile = path.join('public', m.poster);
  if (!fs.existsSync(localFile)) {
    console.error(`FAIL: Missing poster file at ${localFile} for ${m.title}`);
    missingPosters++;
  }
});
if (missingPosters > 0) {
  console.error(`FAIL: ${missingPosters} poster files are missing!`);
  process.exit(1);
}
console.log(`   PASS: All ${movies.length} poster files exist locally in public/images/movies/.`);

// Check 5: Where to Watch Options & Statistics
console.log('\nCHECK 5: Where to Watch Streaming Options');
let moviesWithStreaming = 0;
let moviesWithoutStreaming = 0;
let totalWatchLinks = 0;
let invalidWatchLinks = 0;

movies.forEach(m => {
  if (Array.isArray(m.watchOptions) && m.watchOptions.length > 0) {
    moviesWithStreaming++;
    totalWatchLinks += m.watchOptions.length;
    m.watchOptions.forEach(opt => {
      if (!opt.platform || !opt.url || !opt.type) {
        console.error(`FAIL: Invalid watch option in ${m.title}:`, opt);
        invalidWatchLinks++;
      }
      if (!opt.url.startsWith('http://') && !opt.url.startsWith('https://')) {
        console.error(`FAIL: Non-HTTP URL in watch option for ${m.title}: ${opt.url}`);
        invalidWatchLinks++;
      }
    });
  } else {
    moviesWithoutStreaming++;
  }
});

console.log(`   Movies with Verified Streaming Options: ${moviesWithStreaming}`);
console.log(`   Total Verified Watch Links: ${totalWatchLinks}`);
console.log(`   Movies with Unavailable State (Graceful fallback): ${moviesWithoutStreaming}`);
if (invalidWatchLinks > 0) {
  process.exit(1);
}
console.log('   PASS: All watch options follow { platform, url, type } schema with valid URLs.');

// Check 6: IMDb External Link Absence
console.log('\nCHECK 6: Verify Absence of IMDb External Links');
let imdbLeaks = 0;
function scanForImdb(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      scanForImdb(full);
    } else if (f.endsWith('.ts') || f.endsWith('.tsx')) {
      const src = fs.readFileSync(full, 'utf8');
      if (src.includes('imdb.com/title/') || src.includes('imdbUrl') || src.includes('imdbId')) {
        console.error(`FAIL: Leaked IMDb external link in ${full}`);
        imdbLeaks++;
      }
    }
  }
}
scanForImdb('src');
if (imdbLeaks > 0) {
  console.error(`FAIL: Found ${imdbLeaks} instances of IMDb external links/fields.`);
  process.exit(1);
}
console.log('   PASS: Zero IMDb external links or IMDb IDs across all src/ files.');

// Check 7: Language Distribution
console.log('\nCHECK 7: Language & Industry Distribution');
const byLang = {};
const byInd = {};
movies.forEach(m => {
  byLang[m.language] = (byLang[m.language] || 0) + 1;
  byInd[m.industry] = (byInd[m.industry] || 0) + 1;
});
console.log('   Languages:', byLang);
console.log('   Industries:', byInd);

console.log('\n========================================================');
console.log('   ALL STATIC & DATABASE CHECKS PASSED SUCCESSFULLY!    ');
console.log('========================================================\n');
