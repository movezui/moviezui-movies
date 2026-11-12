// scripts/verify_kannada_and_malayalam.cjs
const fs = require("fs");
const path = require("path");

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const targets = list.filter(m => m.language === "Kannada" || m.language === "Malayalam");

console.log(`Auditing ${targets.length} movies (Kannada & Malayalam)...`);

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
  "excel movies", "hombale films", "goldmines", "pen movies", "t-series", "dharma productions",
  "netflix india", "prime video india", "salman khan films", "zee studios", "ufo moviez"
];

async function run() {
  const verified = [];
  for (let i = 0; i < targets.length; i++) {
    const m = targets[i];
    console.log(`\n[${i + 1}/${targets.length}] Auditing: ${m.title} (${m.releaseYear}, ${m.language})...`);

    let bestHindi = null;
    let bestOrig = null;

    // 1. Search Hindi dubbed trailer
    const hindiRes = await searchYT(`"${m.title}" official hindi trailer`);
    for (const r of hindiRes.slice(0, 6)) {
      const lowerTitle = r.title.toLowerCase();
      const lowerChan = r.channel.toLowerCase();
      const isOfficial = OFFICIAL_HINDI_CHANNELS.some(c => lowerChan.includes(c));

      // Sequel check
      if (!m.title.includes("2") && !m.title.includes("Chapter 2") && (lowerTitle.includes("chapter 2") || lowerTitle.includes("part 2") || lowerTitle.includes("chapter 1 trailer - hindi | rishab"))) {
        continue;
      }

      if (isOfficial && (lowerTitle.includes("hindi") || lowerChan.includes("excel") || lowerChan.includes("goldmines")) && lowerTitle.includes("trailer") && !lowerTitle.includes("review") && !lowerTitle.includes("scene") && !lowerTitle.includes("song")) {
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

    // 2. If no Hindi trailer, find official original language trailer
    if (!bestHindi) {
      const origRes = await searchYT(`"${m.title}" ${m.releaseYear} official trailer ${m.language}`);
      for (const r of origRes.slice(0, 8)) {
        const lowerTitle = r.title.toLowerCase();
        if ((lowerTitle.includes("trailer") || lowerTitle.includes("teaser")) && !lowerTitle.includes("review") && !lowerTitle.includes("reaction") && !lowerTitle.includes("scene")) {
          if (!m.title.includes("2") && !m.title.includes("Chapter 2") && (lowerTitle.includes("chapter 2") || lowerTitle.includes("part 2"))) {
            continue;
          }
          const oe = await getOEmbed(r.id);
          if (oe) {
            bestOrig = {
              videoId: r.id,
              title: oe.title,
              channel: oe.author_name,
              trailerLanguage: `Original (${m.language})`,
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
      language: m.language,
      trailerYoutubeId: chosen.videoId,
      trailerUrl: chosen.videoId ? `https://www.youtube.com/watch?v=${chosen.videoId}` : null,
      trailerTitle: chosen.title,
      trailerChannel: chosen.channel,
      trailerLanguage: chosen.trailerLanguage,
      hindiAvailable: chosen.hindiAvailable,
      verificationStatus: chosen.verificationStatus
    });
  }

  fs.writeFileSync(path.join(__dirname, "verified_kannada_malayalam.json"), JSON.stringify(verified, null, 2));
  console.log("\nSaved verified Kannada & Malayalam movies to scripts/verified_kannada_malayalam.json");
}

run();
