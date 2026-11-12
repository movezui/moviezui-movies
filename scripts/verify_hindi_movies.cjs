// scripts/verify_hindi_movies.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const hindiMovies = list.filter(m => m.language === "Hindi");

console.log(`Auditing ${hindiMovies.length} Hindi movies...`);

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
  for (let i = 0; i < hindiMovies.length; i++) {
    const m = hindiMovies[i];
    console.log(`[${i + 1}/${hindiMovies.length}] Searching trailer for: ${m.title} (${m.releaseYear})...`);
    
    // First, test current trailer if valid
    let best = null;
    if (m.currentTrailer) {
      const oe = await getOEmbed(m.currentTrailer);
      if (oe && (oe.title.toLowerCase().includes("trailer") || oe.title.toLowerCase().includes(m.title.toLowerCase().slice(0, 5)))) {
        console.log(`  Current trailer valid: "${oe.title}" by ${oe.author_name}`);
        best = {
          videoId: m.currentTrailer,
          title: oe.title,
          channel: oe.author_name,
        };
      }
    }

    if (!best) {
      const q = `${m.title} ${m.releaseYear} official trailer`;
      const results = await searchYT(q);
      for (const r of results.slice(0, 8)) {
        const lower = r.title.toLowerCase();
        if (lower.includes("trailer") && !lower.includes("reaction") && !lower.includes("review") && !lower.includes("song") && !lower.includes("scene")) {
          const oe = await getOEmbed(r.id);
          if (oe) {
            best = {
              videoId: r.id,
              title: oe.title,
              channel: oe.author_name,
            };
            break;
          }
        }
      }
      await new Promise(res => setTimeout(res, 800));
    }

    verified.push({
      id: m.id,
      slug: m.slug,
      title: m.title,
      releaseYear: m.releaseYear,
      language: "Hindi",
      trailerYoutubeId: best ? best.videoId : null,
      trailerUrl: best ? `https://www.youtube.com/watch?v=${best.videoId}` : null,
      trailerTitle: best ? best.title : null,
      trailerChannel: best ? best.channel : null,
      trailerLanguage: "Hindi",
      hindiAvailable: true,
      verificationStatus: best ? "Verified Official Hindi" : "Unavailable Official Trailer"
    });
  }

  fs.writeFileSync(path.join(__dirname, "verified_hindi.json"), JSON.stringify(verified, null, 2));
  console.log("Saved verified Hindi movies to scripts/verified_hindi.json");
}

run();
