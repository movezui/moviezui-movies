// scripts/pilot_trailer_audit.cjs
const fs = require("fs");

async function getOEmbed(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

async function searchYouTube(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      },
    });
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/) ||
                  html.match(/window\["ytInitialData"\] = ({[\s\S]+?});<\/script>/);
    if (!match) return [];
    
    const data = JSON.parse(match[1]);
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    
    const results = [];
    for (const item of contents) {
      const vr = item.videoRenderer;
      if (!vr) continue;
      const videoId = vr.videoId;
      const title = vr.title?.runs?.map(r => r.text).join("") || "";
      const channel = vr.ownerText?.runs?.map(r => r.text).join("") || "";
      const length = vr.lengthText?.simpleText || "";
      results.push({ videoId, title, channel, length });
    }
    return results;
  } catch (e) {
    console.error(`Search error for "${query}":`, e.message);
    return [];
  }
}

function cleanTitle(title) {
  return title.replace(/[:!?,.-]/g, " ").replace(/\s+/g, " ").trim();
}

function isTrailerLength(lenStr) {
  if (!lenStr) return true;
  const parts = lenStr.split(":").map(Number);
  if (parts.length === 2) {
    const totalSecs = parts[0] * 60 + parts[1];
    return totalSecs >= 40 && totalSecs <= 360; // 40s to 6 mins
  }
  return false;
}

function isJunkTitle(title) {
  const lower = title.toLowerCase();
  const junkPatterns = [
    "review", "reaction", "explained", "full movie", "jukebox", "audio jukebox",
    "video song", "lyric video", "spoiler", "roast", "interview", "press meet",
    "teaser 1", "glimpse", "promo song", "behind the scenes", "making of",
    "status", "whatsapp status", "shorts", "scenes", "comedy scene", "fight scene"
  ];
  return junkPatterns.some(p => lower.includes(p));
}

async function findBestTrailer(movie) {
  const baseTitle = cleanTitle(movie.title);
  console.log(`\nEvaluating [${movie.id}] "${movie.title}" (${movie.releaseYear}, ${movie.language})...`);

  // If Hindi movie: search official trailer
  if (movie.language === "Hindi") {
    const queries = [
      `${baseTitle} ${movie.releaseYear} Official Trailer`,
      `${baseTitle} Official Trailer`,
      `${baseTitle} Trailer ${movie.director}`,
    ];
    for (const q of queries) {
      const results = await searchYouTube(q);
      for (const res of results) {
        if (isJunkTitle(res.title) || !isTrailerLength(res.length)) continue;
        const lower = res.title.toLowerCase();
        if (lower.includes("trailer")) {
          // verify oembed
          const oe = await getOEmbed(res.videoId);
          if (oe) {
            return {
              videoId: res.videoId,
              title: oe.title,
              channel: oe.author_name,
              trailerLanguage: "Hindi",
              hindiAvailable: true,
              verificationStatus: "Verified Official Hindi",
              method: `Direct Hindi Search: "${q}"`
            };
          }
        }
      }
    }
  } else {
    // Non-Hindi movie: Priority 1 - Official Hindi Trailer / Dubbed Trailer
    const hindiQueries = [
      `${baseTitle} ${movie.releaseYear} Official Hindi Trailer`,
      `${baseTitle} Official Trailer Hindi`,
      `${baseTitle} Hindi Dubbed Trailer`,
      `${baseTitle} Hindi Trailer`,
    ];

    for (const q of hindiQueries) {
      const results = await searchYouTube(q);
      for (const res of results) {
        if (isJunkTitle(res.title) || !isTrailerLength(res.length)) continue;
        const lower = res.title.toLowerCase();
        if (lower.includes("hindi") && lower.includes("trailer")) {
          const oe = await getOEmbed(res.videoId);
          if (oe) {
            return {
              videoId: res.videoId,
              title: oe.title,
              channel: oe.author_name,
              trailerLanguage: "Hindi",
              hindiAvailable: true,
              verificationStatus: "Verified Official Hindi",
              method: `Hindi Dubbed Search: "${q}"`
            };
          }
        }
      }
    }

    // Fallback: Official Original-Language Trailer (Hindi unavailable)
    const origQueries = [
      `${baseTitle} ${movie.releaseYear} Official Trailer`,
      `${baseTitle} Official Trailer ${movie.language}`,
      `${baseTitle} Official Trailer`,
    ];
    for (const q of origQueries) {
      const results = await searchYouTube(q);
      for (const res of results) {
        if (isJunkTitle(res.title) || !isTrailerLength(res.length)) continue;
        const lower = res.title.toLowerCase();
        if (lower.includes("trailer")) {
          const oe = await getOEmbed(res.videoId);
          if (oe) {
            return {
              videoId: res.videoId,
              title: oe.title,
              channel: oe.author_name,
              trailerLanguage: `Original (${movie.language})`,
              hindiAvailable: false,
              verificationStatus: `Verified Official Original (Hindi Unavailable)`,
              method: `Original Language Fallback Search: "${q}"`
            };
          }
        }
      }
    }
  }

  return {
    videoId: null,
    title: null,
    channel: null,
    trailerLanguage: "None",
    hindiAvailable: false,
    verificationStatus: "Unavailable Official Trailer",
    method: "No official trailer found"
  };
}

async function run() {
  const sample = [
    { id: "1", title: "Hellaro", releaseYear: 2019, language: "Gujarati", director: "Abhishek Shah" },
    { id: "2", title: "Chhello Divas", releaseYear: 2015, language: "Gujarati", director: "Krishnadev Yagnik" },
    { id: "31", title: "Dangal", releaseYear: 2016, language: "Hindi", director: "Nitesh Tiwari" },
    { id: "32", title: "3 Idiots", releaseYear: 2009, language: "Hindi", director: "Rajkumar Hirani" },
    { id: "98", title: "RRR", releaseYear: 2022, language: "Telugu", director: "S.S. Rajamouli" },
    { id: "99", title: "Baahubali: The Beginning", releaseYear: 2015, language: "Telugu", director: "S. S. Rajamouli" },
    { id: "100", title: "Pushpa: The Rise", releaseYear: 2021, language: "Telugu", director: "Sukumar" },
    { id: "65", title: "Avengers: Endgame", releaseYear: 2019, language: "English", director: "Anthony and Joe Russo" },
    { id: "68", title: "Inception", releaseYear: 2010, language: "English", director: "Christopher Nolan" },
    { id: "115", title: "Vikram", releaseYear: 2022, language: "Tamil", director: "Lokesh Kanagaraj" },
  ];

  for (const m of sample) {
    const res = await findBestTrailer(m);
    console.log(`=> Result:`, res);
  }
}

run();
