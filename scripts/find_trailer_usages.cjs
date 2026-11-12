// scripts/find_trailer_usages.cjs
const fs = require("fs");
const path = require("path");

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const full = path.join(dir, file);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) {
      results = results.concat(walk(full));
    } else if (file.endsWith(".tsx") || file.endsWith(".ts")) {
      const content = fs.readFileSync(full, "utf8");
      if (content.includes("trailerYoutubeId") || content.includes("Play Trailer") || content.includes("trailer")) {
        results.push(full);
      }
    }
  }
  return results;
}

console.log(walk(path.join(__dirname, "..", "src")));
