// scripts/export_catalog_by_industry.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const grouped = {};

list.forEach(m => {
  if (!grouped[m.language]) grouped[m.language] = [];
  grouped[m.language].push(m);
});

for (const [lang, movies] of Object.entries(grouped)) {
  console.log(`\n==================================================`);
  console.log(`=== ${lang.toUpperCase()} CINEMA (${movies.length} MOVIES) ===`);
  console.log(`==================================================`);
  movies.forEach(m => {
    console.log(`[${m.id}] ${m.title} (${m.releaseYear}) | Dir: ${m.director} | Slug: ${m.slug}`);
  });
}
