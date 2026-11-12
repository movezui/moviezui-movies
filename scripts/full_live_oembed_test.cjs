// scripts/full_live_oembed_test.cjs
const fs = require("fs");
const path = require("path");

const catalog = JSON.parse(fs.readFileSync(path.join(__dirname, "full_verified_catalog.json"), "utf8"));
console.log(`Testing all ${catalog.length} catalog items for live oEmbed validity...`);

async function run() {
  let passed = 0;
  let failed = 0;
  let nullCount = 0;

  for (let i = 0; i < catalog.length; i++) {
    const m = catalog[i];
    if (!m.trailerYoutubeId) {
      nullCount++;
      continue;
    }

    try {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${m.trailerYoutubeId}&format=json`);
      if (res.ok) {
        passed++;
      } else {
        failed++;
        console.error(`[FAIL] ${m.title} (${m.trailerYoutubeId}): Status ${res.status}`);
      }
    } catch (e) {
      failed++;
      console.error(`[ERR] ${m.title} (${m.trailerYoutubeId}): ${e.message}`);
    }

    if ((i + 1) % 25 === 0) {
      console.log(`Progress: ${i + 1}/${catalog.length} checked...`);
    }
  }

  console.log("\n================ LIVE OEMBED AUDIT RESULT ================");
  console.log(`Passed (200 OK):      ${passed}`);
  console.log(`Failed (Dead/404):    ${failed}`);
  console.log(`Intentionally Null:   ${nullCount}`);
  console.log(`Total:                ${passed + failed + nullCount}`);
  console.log("==========================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

run();
