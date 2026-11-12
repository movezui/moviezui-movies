// scripts/test_parse_movies_2.cjs
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "..", "src", "data", "movies.ts"), "utf8");
const marker = "export const movies: Movie[] = [";
const markerIndex = content.indexOf(marker);
const arrayStart = content.indexOf("[", markerIndex + 25);
const arrayEnd = content.lastIndexOf("]");
const jsonString = content.substring(arrayStart, arrayEnd + 1);

try {
  const parsed = JSON.parse(jsonString);
  console.log("Successfully parsed movies array as JSON! Count:", parsed.length);
} catch (e) {
  console.error("Failed to parse as JSON:", e.message);
}
