// scripts/audit_remaining_49.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const auditedLanguages = ["Hindi", "Gujarati", "English", "Telugu", "Tamil", "Kannada", "Malayalam"];
const targets = list.filter(m => !auditedLanguages.includes(m.language));

console.log(`Auditing remaining ${targets.length} movies...`);

async function getOEmbed(videoId) {
  if (!videoId) return null;
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function searchYT(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return [];
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
    if (!match) return [];
    const data = JSON.parse(match[1]);
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    const items = [];
    for (const c of contents) {
      if (c.videoRenderer) {
        items.push({
          id: c.videoRenderer.videoId,
          title: c.videoRenderer.title?.runs?.map(r => r.text).join("") || "",
          channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join("") || "",
        });
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

async function run() {
  const auditResults = [];

  for (let i = 0; i < targets.length; i++) {
    const m = targets[i];
    console.log(`\n[${i + 1}/${targets.length}] ${m.title} (${m.releaseYear}, ${m.language}) [slug: ${m.slug}]`);

    // 1. Search Hindi trailer
    const hindiQuery = `${m.title} official Hindi trailer`;
    const hindiRes = await searchYT(hindiQuery);
    let chosenHindi = null;

    for (const r of hindiRes.slice(0, 5)) {
      const lowerT = r.title.toLowerCase();
      const lowerC = r.channel.toLowerCase();
      if ((lowerT.includes("hindi") || lowerC.includes("panorama") || lowerC.includes("eros") || lowerC.includes("t-series") || lowerC.includes("goldmines") || lowerC.includes("pen")) &&
          (lowerT.includes("trailer") || lowerT.includes("teaser")) &&
          !lowerT.includes("reaction") && !lowerT.includes("review")) {
        const oe = await getOEmbed(r.id);
        if (oe) {
          chosenHindi = {
            id: r.id,
            title: oe.title,
            channel: oe.author_name,
            lang: "Hindi",
            isHindi: true
          };
          break;
        }
      }
    }

    if (chosenHindi) {
      console.log(`  -> Found Hindi: [${chosenHindi.id}] ${chosenHindi.channel} : ${chosenHindi.title}`);
      auditResults.push({
        movie: m,
        trailer: chosenHindi
      });
      await new Promise(r => setTimeout(r, 600));
      continue;
    }

    // 2. Search Original Trailer
    const origQuery = `${m.title} ${m.releaseYear} official trailer`;
    const origRes = await searchYT(origQuery);
    let chosenOrig = null;

    for (const r of origRes.slice(0, 8)) {
      const lowerT = r.title.toLowerCase();
      if ((lowerT.includes("trailer") || lowerT.includes("teaser")) &&
          !lowerT.includes("reaction") && !lowerT.includes("review") && !lowerT.includes("full movie") && !lowerT.includes("status")) {
        // Sequel check
        if (!m.title.includes("2") && (lowerT.includes("part 2") || lowerT.includes("chapter 2") || lowerT.includes(" 2 trailer") || lowerT.includes(" 2 official"))) {
          continue;
        }
        const oe = await getOEmbed(r.id);
        if (oe) {
          chosenOrig = {
            id: r.id,
            title: oe.title,
            channel: oe.author_name,
            lang: `Original (${m.language})`,
            isHindi: false
          };
          break;
        }
      }
    }

    if (chosenOrig) {
      console.log(`  -> Found Original: [${chosenOrig.id}] ${chosenOrig.channel} : ${chosenOrig.title}`);
      auditResults.push({
        movie: m,
        trailer: chosenOrig
      });
    } else {
      console.log(`  -> [NO DIRECT MATCH] Needs manual query review`);
      auditResults.push({
        movie: m,
        trailer: null
      });
    }

    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync(path.join(__dirname, "audit_remaining_raw.json"), JSON.stringify(auditResults, null, 2));
  console.log("\nSaved raw audit of 49 movies to scripts/audit_remaining_raw.json");
}

run();
