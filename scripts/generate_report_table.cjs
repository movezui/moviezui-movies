// scripts/generate_report_table.cjs
const fs = require("fs");
const path = require("path");

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "full_verified_catalog.json"), "utf8"));
console.log(`Loaded ${catalog.length} items.`);

let md = "";
catalog.forEach((m, i) => {
  const url = m.trailerYoutubeId ? `[Watch](https://www.youtube.com/watch?v=${m.trailerYoutubeId})` : "Unavailable";
  const id = m.trailerYoutubeId || "—";
  const chan = (m.trailerChannel || "—").replace(/\|/g, "-");
  const lang = m.trailerLanguage;
  const status = m.verificationStatus;
  md += `| ${i + 1} | **${m.title.replace(/\|/g, "-")}** | ${m.releaseYear} | ${m.language} | \`${id}\` | ${url} | ${lang} | ${chan} | ${status} |\n`;
});

fs.writeFileSync(path.join(__dirname, "report_table.md"), md, "utf8");
console.log("Generated report table in scripts/report_table.md");
