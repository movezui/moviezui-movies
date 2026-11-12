// scripts/get_remaining.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const auditedLanguages = ["Hindi", "Gujarati", "English", "Telugu", "Tamil", "Kannada", "Malayalam"];
const remaining = list.filter(m => !auditedLanguages.includes(m.language));

console.log(`Remaining movies count: ${remaining.length}`);
const byLang = {};
for (const m of remaining) {
  byLang[m.language] = byLang[m.language] || [];
  byLang[m.language].push({ id: m.id, slug: m.slug, title: m.title, releaseYear: m.releaseYear });
}
console.log(JSON.stringify(byLang, null, 2));
