// scripts/verify_existing_trailers.cjs
const fs = require("fs");
const path = require("path");

const moviesFilePath = path.join(__dirname, "../src/data/movies.ts");
const rawContent = fs.readFileSync(moviesFilePath, "utf-8");
const movies = eval(rawContent.replace(/import type[\s\S]*?export const movies: Movie\[\] =/, ''));

console.log(`Loaded ${movies.length} movies.`);

async function checkOEmbed(videoId) {
  if (!videoId) return { status: "missing" };
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!res.ok) {
      return { status: "invalid_404", code: res.status };
    }
    const data = await res.json();
    return {
      status: "valid",
      title: data.title,
      author: data.author_name,
    };
  } catch (err) {
    return { status: "error", error: err.message };
  }
}

async function run() {
  const results = [];
  let validCount = 0;
  let invalidCount = 0;
  let missingCount = 0;

  for (let i = 0; i < movies.length; i++) {
    const m = movies[i];
    const oe = await checkOEmbed(m.trailerYoutubeId);
    
    let isHindi = false;
    let isTrailer = false;
    if (oe.status === "valid") {
      validCount++;
      const lower = oe.title.toLowerCase();
      isTrailer = lower.includes("trailer") || lower.includes("teaser");
      isHindi = lower.includes("hindi") || m.language === "Hindi";
    } else if (oe.status === "missing") {
      missingCount++;
    } else {
      invalidCount++;
    }

    results.push({
      idx: i + 1,
      id: m.id,
      slug: m.slug,
      title: m.title,
      releaseYear: m.releaseYear,
      language: m.language,
      industry: m.industry,
      currentTrailerId: m.trailerYoutubeId || null,
      oembedStatus: oe.status,
      ytTitle: oe.title || null,
      ytAuthor: oe.author || null,
      isTrailer,
      isHindi,
    });

    if ((i + 1) % 25 === 0 || i === movies.length - 1) {
      console.log(`Checked ${i + 1}/${movies.length}... (Valid: ${validCount}, Invalid/404: ${invalidCount}, Missing: ${missingCount})`);
    }

    // small delay to avoid rate limit
    await new Promise(r => setTimeout(r, 60));
  }

  fs.writeFileSync(path.join(__dirname, "existing_trailers_check.json"), JSON.stringify(results, null, 2));
  console.log("Finished checking all existing trailers. Saved to scripts/existing_trailers_check.json");
}

run();
