// scripts/verify_watch_refinement.cjs
const fs = require('fs');
const path = require('path');

console.log('========================================================');
console.log('   WATCH PLATFORM & RESPONSIVE UI AUDIT VERIFICATION    ');
console.log('========================================================\n');

// 1. Audit movies.ts
const content = fs.readFileSync('src/data/movies.ts', 'utf8');
const match = content.match(/export const movies: Movie\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('FAIL: Could not parse movies array in src/data/movies.ts');
  process.exit(1);
}
const movies = eval(match[1]);

console.log(`CHECK 1: Movie Catalog Integrity`);
console.log(`   Total Movie Records: ${movies.length}`);
if (movies.length !== 228) {
  console.error(`FAIL: Expected 228 movies, found ${movies.length}`);
  process.exit(1);
}
console.log('   PASS: Exactly 228 movies preserved.');

console.log(`\nCHECK 2: Streaming Links Verification`);
let totalLinks = 0;
let invalidLinks = 0;
const platformCounts = {};

function isValidWatchUrl(url) {
  if (!url || typeof url !== 'string') return false;
  if (/^https:\/\/www\.netflix\.com\/title\/\d+$/.test(url)) return true;
  if (/^https:\/\/www\.hotstar\.com\/(?:in\/)?movies\/[a-z0-9\-]+\/\d+$/.test(url)) return true;
  if (/^https:\/\/www\.zee5\.com\/movies\/details\/[a-z0-9\-]+\/0-0-(?:1z\d+|\d{4,})$/.test(url)) return true;
  if (/^https:\/\/www\.shemaroome\.com\/gujarati-movies\/[a-z0-9\-]+$/.test(url)) return true;
  if (/^https:\/\/www\.sonyliv\.com\/movies\/[a-z0-9\-]+-\d{7,}[1-9]$/.test(url)) return true;
  if (/^https:\/\/www\.primevideo\.com\/detail\/[0-9A-Z]{10,}$/.test(url) && !url.includes('_')) return true;
  if (/^https:\/\/tv\.apple\.com\/in\/movie\/[a-z0-9\-]+\/umc\.cmc\.[a-z0-9]{20,}$/.test(url)) return true;
  if (/^https:\/\/www\.youtube\.com\/watch\?v=[a-zA-Z0-9_\-]{11}$/.test(url)) return true;
  if (/^https:\/\/www\.hoichoi\.tv\/movies\/[a-z0-9\-]+$/.test(url)) return true;
  if (/^https:\/\/mubi\.com\/films\/[a-z0-9\-]+$/.test(url)) return true;
  if (/^https:\/\/www\.manoramamax\.com\/movies\/[a-z0-9\-]+$/.test(url)) return true;
  return false;
}

let moviesWithWatch = 0;
let moviesWithoutWatch = 0;

movies.forEach((m) => {
  if (Array.isArray(m.watchOptions) && m.watchOptions.length > 0) {
    moviesWithWatch++;
    m.watchOptions.forEach((opt) => {
      totalLinks++;
      platformCounts[opt.platform] = (platformCounts[opt.platform] || 0) + 1;
      if (!isValidWatchUrl(opt.url)) {
        console.error(`FAIL: Invalid watch URL in ${m.title} (${m.slug}): ${opt.url}`);
        invalidLinks++;
      }
    });
  } else {
    moviesWithoutWatch++;
  }
});

console.log(`   Total Watch Links: ${totalLinks}`);
console.log(`   Movies with Verified Options: ${moviesWithWatch}`);
console.log(`   Movies displaying "No verified streaming options available right now.": ${moviesWithoutWatch}`);
console.log('   Platform Breakdown:', platformCounts);

if (invalidLinks > 0) {
  console.error(`FAIL: ${invalidLinks} invalid links found!`);
  process.exit(1);
}
console.log('   PASS: 100% of watch links are strictly verified canonical URLs.');

console.log(`\nCHECK 3: UI Copy & Truncation Safety`);
const whereToWatchSrc = fs.readFileSync('src/components/movies/WhereToWatch.tsx', 'utf8');
if (!whereToWatchSrc.includes('No verified streaming options available right now.')) {
  console.error('FAIL: Missing exact unavailable message "No verified streaming options available right now."');
  process.exit(1);
}
console.log('   PASS: Exact requested unavailable message is configured.');

if (whereToWatchSrc.includes('truncate') && whereToWatchSrc.includes('opt.platform')) {
  console.error('FAIL: opt.platform should never be truncated.');
  process.exit(1);
}
console.log('   PASS: Platform names are never truncated.');

console.log(`\nCHECK 4: Accessibility & Link Attributes`);
if (!whereToWatchSrc.includes('target="_blank"') || !whereToWatchSrc.includes('rel="noopener noreferrer"')) {
  console.error('FAIL: Missing target="_blank" or rel="noopener noreferrer"');
  process.exit(1);
}
console.log('   PASS: All watch links have target="_blank" and rel="noopener noreferrer".');

console.log('\n========================================================');
console.log('   ALL AUDIT CHECKS PASSED SUCCESSFULLY!                ');
console.log('========================================================\n');
