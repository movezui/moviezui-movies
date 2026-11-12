// scripts/check_movies_file.cjs
const fs = require("fs");
const path = require("path");

const content = fs.readFileSync(path.join(__dirname, "..", "src", "data", "movies.ts"), "utf8");
console.log("Length of movies.ts:", content.length);

const verifiedCatalog = JSON.parse(fs.readFileSync(path.join(__dirname, "full_verified_catalog.json"), "utf8"));
console.log("Verified catalog length:", verifiedCatalog.length);
