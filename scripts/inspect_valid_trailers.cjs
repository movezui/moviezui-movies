// scripts/inspect_valid_trailers.cjs
const fs = require("fs");
const path = require("path");

const checks = JSON.parse(fs.readFileSync(path.join(__dirname, "existing_trailers_check.json"), "utf8"));
const valid = checks.filter(c => c.oembedStatus === "valid");

console.log(`Total valid in check: ${valid.length}`);
valid.forEach(v => {
  console.log(`[${v.id}] ${v.title} (${v.releaseYear}, ${v.language}) -> ID: ${v.currentTrailerId} | Author: "${v.ytAuthor}" | Title: "${v.ytTitle}"`);
});
