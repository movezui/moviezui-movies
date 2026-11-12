// scripts/verify_gujarati_movies.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const gujaratiMovies = list.filter(m => m.language === "Gujarati");

console.log(`Auditing ${gujaratiMovies.length} Gujarati movies...`);

async function getOEmbed(videoId) {
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
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
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
          title: c.videoRenderer.title?.runs?.map(r => r.text).join(""),
          channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join(""),
          length: c.videoRenderer.lengthText?.simpleText || "",
        });
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

async function run() {
  const verified = [];
  for (let i = 0; i < gujaratiMovies.length; i++) {
    const m = gujaratiMovies[i];
    console.log(`\n[${i + 1}/${gujaratiMovies.length}] Auditing: ${m.title} (${m.releaseYear})...`);

    let bestHindi = null;
    let bestOrig = null;

    // Search Hindi first
    const hindiRes = await searchYT(`"${m.title}" official hindi trailer`);
    for (const r of hindiRes.slice(0, 5)) {
      const lower = r.title.toLowerCase();
      if ((lower.includes("hindi") || lower.includes("dubbed")) && lower.includes("trailer") && !lower.includes("review") && !lower.includes("scene")) {
        const oe = await getOEmbed(r.id);
        if (oe) {
          bestHindi = {
            videoId: r.id,
            title: oe.title,
            channel: oe.author_name,
            trailerLanguage: "Hindi",
            hindiAvailable: true,
            verificationStatus: "Verified Official Hindi"
          };
          break;
        }
      }
    }
    await new Promise(r => setTimeout(r, 600));

    if (!bestHindi) {
      // Search Original Gujarati trailer
      const origRes = await searchYT(`"${m.title}" ${m.releaseYear} official trailer`);
      for (const r of origRes.slice(0, 6)) {
        const lower = r.title.toLowerCase();
        if (lower.includes("trailer") && !lower.includes("review") && !lower.includes("reaction") && !lower.includes("scene") && !lower.includes("sign language")) {
          const oe = await getOEmbed(r.id);
          if (oe) {
            bestOrig = {
              videoId: r.id,
              title: oe.title,
              channel: oe.author_name,
              trailerLanguage: "Original (Gujarati)",
              hindiAvailable: false,
              verificationStatus: "Verified Official Original (Hindi Unavailable)"
            };
            break;
          }
        }
      }
      await new Promise(r => setTimeout(r, 600));
    }

    const chosen = bestHindi || bestOrig || {
      videoId: null,
      title: null,
      channel: null,
      trailerLanguage: "None",
      hindiAvailable: false,
      verificationStatus: "Unavailable Official Trailer"
    };

    console.log(`  => Status: ${chosen.verificationStatus} | ID: ${chosen.videoId} | Chan: "${chosen.channel}" | Title: "${chosen.title}"`);

    verified.push({
      id: m.id,
      slug: m.slug,
      title: m.title,
      releaseYear: m.releaseYear,
      language: "Gujarati",
      trailerYoutubeId: chosen.videoId,
      trailerUrl: chosen.videoId ? `https://www.youtube.com/watch?v=${chosen.videoId}` : null,
      trailerTitle: chosen.title,
      trailerChannel: chosen.channel,
      trailerLanguage: chosen.trailerLanguage,
      hindiAvailable: chosen.hindiAvailable,
      verificationStatus: chosen.verificationStatus
    });
  }

  fs.writeFileSync(path.join(__dirname, "verified_gujarati.json"), JSON.stringify(verified, null, 2));
  console.log("\nSaved verified Gujarati movies to scripts/verified_gujarati.json");
}

run();
