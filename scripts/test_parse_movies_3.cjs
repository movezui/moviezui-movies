// scripts/test_parse_movies_3.cjs
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "..", "src", "data", "movies.ts"), "utf8");
const marker = "export const movies: Movie[] = ";
const markerIndex = content.indexOf(marker);
const arrayStart = content.indexOf("[", markerIndex);
const arrayEnd = content.lastIndexOf("]");
const jsonString = content.substring(arrayStart, arrayEnd + 1);

console.log("Snippet:", jsonString.slice(0, 50));
try {
  const parsed = JSON.parse(jsonString);
  console.log("Parsed! Length:", parsed.length);
} catch (e) {
  console.error("Error:", e.message);
  // find position
  const match = e.message.match(/position (\d+)/);
  if (match) {
    const pos = parseInt(match[1]);
    console.log("Context around error:", jsonString.substring(Math.max(0, pos - 50), pos + 50));
  }
}
