// scripts/test_parse_movies_4.cjs
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "..", "src", "data", "movies.ts"), "utf8");
const marker = "export const movies: Movie[] =";
const markerIndex = content.indexOf(marker);
const arrayStart = content.indexOf("[", markerIndex + marker.length);
const arrayEnd = content.lastIndexOf("]");
const jsonString = content.substring(arrayStart, arrayEnd + 1);

console.log("Snippet:", jsonString.slice(0, 50));
try {
  const parsed = JSON.parse(jsonString);
  console.log("SUCCESS! Parsed all movies! Total count:", parsed.length);
} catch (e) {
  console.error("Error:", e.message);
}
