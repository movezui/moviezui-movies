// scripts/inspect_hindi_results.cjs
const fs = require("fs");
const path = require("path");

const data = JSON.parse(fs.readFileSync(path.join(__dirname, "verified_hindi.json"), "utf8"));
console.log(`Total Hindi movies: ${data.length}`);
let found = 0;
data.forEach((m, idx) => {
  if (m.trailerYoutubeId) found++;
  console.log(`[${idx + 1}] ${m.title} (${m.releaseYear}) -> ID: ${m.trailerYoutubeId} | Chan: "${m.trailerChannel}" | Title: "${m.trailerTitle}"`);
});
console.log(`\nVerified Hindi found: ${found}/${data.length}`);
