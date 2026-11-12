// scripts/show_ranges.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const byLang = {};

list.forEach(m => {
  if (!byLang[m.language]) byLang[m.language] = [];
  byLang[m.language].push(m);
});

for (const [lang, arr] of Object.entries(byLang)) {
  console.log(`${lang} (${arr.length} movies): idx ${arr[0].idx} (id: ${arr[0].id}, ${arr[0].title}) to idx ${arr[arr.length - 1].idx} (id: ${arr[arr.length - 1].id}, ${arr[arr.length - 1].title})`);
}
