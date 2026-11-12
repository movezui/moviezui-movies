// scripts/check_slugs.cjs
const fs = require("fs");
const path = require("path");
const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const targets = list.filter(m => m.language === "Kannada" || m.language === "Malayalam");
console.log(targets.map(m => ({ title: m.title, slug: m.slug })));
