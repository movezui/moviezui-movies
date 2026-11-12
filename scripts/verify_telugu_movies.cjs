// scripts/verify_telugu_movies.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const teluguMovies = list.filter(m => m.language === "Telugu");

console.log(`Auditing ${teluguMovies.length} Telugu movies...`);

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

const OFFICIAL_HINDI_CHANNELS = [
  "pen movies", "goldmines", "t-series", "dharma productions", "excel movies", "hombale films",
  "vyjayanthi network", "sony pictures india", "mythri movie makers", "rkd studios", "zee studios",
  "prime video india", "netflix india", "aditya movies", "geetha arts"
];

async function run() {
  const verified = [];
  for (let i = 0; i < teluguMovies.length; i++) {
    const m = teluguMovies[i];
    console.log(`\n[${i + 1}/${teluguMovies.length}] Auditing: ${m.title} (${m.releaseYear})...`);

    let bestHindi = null;
    let bestOrig = null;

    // 1. Search Hindi dubbed trailer
    const hindiRes = await searchYT(`"${m.title}" official hindi trailer`);
    for (const r of hindiRes.slice(0, 6)) {
      const lowerTitle = r.title.toLowerCase();
      const lowerChan = r.channel.toLowerCase();
      const isOfficial = OFFICIAL_HINDI_CHANNELS.some(c => lowerChan.includes(c));

      // Check sequel mismatch
      if (!m.title.includes("2") && (lowerTitle.includes(" 2 ") || lowerTitle.includes("conclusion") || lowerTitle.includes("part 2"))) {
        continue;
      }

      if (isOfficial && (lowerTitle.includes("hindi") || lowerChan.includes("pen movies") || lowerChan.includes("goldmines")) && lowerTitle.includes("trailer") && !lowerTitle.includes("review") && !lowerTitle.includes("reaction") && !lowerTitle.includes("scene") && !lowerTitle.includes("song")) {
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

    // 2. If no Hindi trailer, find official Telugu trailer
    if (!bestHindi) {
      const origRes = await searchYT(`"${m.title}" ${m.releaseYear} official trailer telugu`);
      for (const r of origRes.slice(0, 8)) {
        const lowerTitle = r.title.toLowerCase();
        if (lowerTitle.includes("trailer") && !lowerTitle.includes("review") && !lowerTitle.includes("reaction") && !lowerTitle.includes("scene")) {
          // Check sequel mismatch
          if (!m.title.includes("2") && (lowerTitle.includes(" 2 ") || lowerTitle.includes("conclusion") || lowerTitle.includes("part 2"))) {
            continue;
          }
          const oe = await getOEmbed(r.id);
          if (oe) {
            bestOrig = {
              videoId: r.id,
              title: oe.title,
              channel: oe.author_name,
              trailerLanguage: "Original (Telugu)",
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

    console.log(`  => Status: ${chosen.verificationStatus} | ID: ${chosen.videoId} | Lang: ${chosen.trailerLanguage} | Chan: "${chosen.channel}" | Title: "${chosen.title}"`);

    verified.push({
      id: m.id,
      slug: m.slug,
      title: m.title,
      releaseYear: m.releaseYear,
      language: "Telugu",
      trailerYoutubeId: chosen.videoId,
      trailerUrl: chosen.videoId ? `https://www.youtube.com/watch?v=${chosen.videoId}` : null,
      trailerTitle: chosen.title,
      trailerChannel: chosen.channel,
      trailerLanguage: chosen.trailerLanguage,
      hindiAvailable: chosen.hindiAvailable,
      verificationStatus: chosen.verificationStatus
    });
  }

  fs.writeFileSync(path.join(__dirname, "verified_telugu.json"), JSON.stringify(verified, null, 2));
  console.log("\nSaved verified Telugu movies to scripts/verified_telugu.json");
}

run();
