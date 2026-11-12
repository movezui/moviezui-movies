// scripts/batch_audit_engine.cjs
const fs = require("fs");
const path = require("path");

const moviesList = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));
const auditFilePath = path.join(__dirname, "full_audit_database.json");

let auditDb = {};
if (fs.existsSync(auditFilePath)) {
  try {
    auditDb = JSON.parse(fs.readFileSync(auditFilePath, "utf8"));
  } catch (e) {
    auditDb = {};
  }
}

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
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      },
    });
    if (!res.ok) return [];
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
    return [];
  }
}

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}

function isJunk(title) {
  const t = title.toLowerCase();
  const junkTerms = [
    "review", "reaction", "explained", "full movie", "jukebox", "audio jukebox",
    "video song", "lyric video", "spoiler", "roast", "interview", "press meet",
    "public review", "box office", "scene", "comedy scene", "status", "whatsapp",
    "spoof", "making of", "behind the scenes", "facts", "mistakes", "ending explained",
    "sign language"
  ];
  return junkTerms.some(term => t.includes(term));
}

function parseDurationSeconds(lenStr) {
  if (!lenStr) return 120;
  const parts = lenStr.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 120;
}

const OFFICIAL_CHANNELS = [
  "t-series", "yrf", "yash raj films", "dharma productions", "red chillies", "zee studios",
  "utv motion pictures", "eros now", "jio studios", "aamir khan", "excel movies", "viacom18",
  "pen movies", "sony pictures", "sony music", "warner bros", "universal pictures", "marvel",
  "goldmines", "hombale films", "mythri movie makers", "dvv entertainment", "geetha arts",
  "sun tv", "lyca productions", "saregama", "tips official", "balajimotionpictures", "maddock films",
  "foxstarhindi", "nadiadwalagrandson", "reliance entertainment", "svf", "windows", "anand pandit",
  "shemaroo", "harfanmaula films", "d2r films", "think music", "aditya music", "lahari music",
  "netflix", "prime video", "disney", "lionsgate", "paramount", "20th century", "a24",
  "zee music", "speed records", "white hill music", "coconut motion pictures", "cineman productions",
  "zen music", "brainbox studios", "rajshri", "times music", "tips"
];

function isHindiTrailer(cand, movie) {
  if (movie.language === "Hindi") return true;
  const title = cand.title.toLowerCase();
  const channel = cand.channel.toLowerCase();

  if (title.includes("hindi") || title.includes("हिंदी")) {
    return true;
  }
  const hindiChannels = [
    "pen movies", "goldmines", "indiamarvel", "marvel india", "sony pictures india",
    "warner bros. india", "universal pictures india", "fox star hindi", "zee cinema"
  ];
  if (hindiChannels.some(h => channel.includes(h)) && !title.includes("telugu") && !title.includes("tamil") && !title.includes("kannada") && !title.includes("malayalam")) {
    return true;
  }
  return false;
}

function scoreCandidate(cand, movie, isSearchingHindi) {
  const title = cand.title.toLowerCase();
  const channel = cand.channel.toLowerCase();
  const dur = parseDurationSeconds(cand.length);

  if (isJunk(title)) return -100;
  if (dur < 25 || dur > 420) return -100;

  let score = 0;

  const normMovie = normalizeTitle(movie.title);
  const normCand = normalizeTitle(cand.title);

  // Sequel checks
  if (!normMovie.includes("2") && !normMovie.includes("two") && !normMovie.includes("part 2") && !normMovie.includes("chapter 2")) {
    if (normCand.includes(" 2 ") || normCand.includes("part 2") || normCand.includes("chapter 2") || normCand.includes("returns")) {
      return -100;
    }
  }
  if (!normMovie.includes("3") && !normMovie.includes("three") && !normMovie.includes("part 3") && !normMovie.includes("chapter 3")) {
    if (normCand.includes(" 3 ") || normCand.includes("part 3") || normCand.includes("chapter 3")) {
      return -100;
    }
  }

  // Must match core words
  const movieWords = normMovie.split(" ").filter(w => w.length > 2 && w !== "the" && w !== "part" && w !== "chapter");
  const matchedWords = movieWords.filter(w => normCand.includes(w));
  if (movieWords.length > 0 && matchedWords.length / movieWords.length < 0.5) {
    return -50;
  }
  score += matchedWords.length * 20;

  // Trailer word presence
  if (title.includes("trailer")) score += 35;
  else if (title.includes("teaser")) score += 10;
  else return -50;

  if (title.includes("official")) score += 20;

  // Channel bonus
  const isOfficialChan = OFFICIAL_CHANNELS.some(c => channel.includes(c));
  if (isOfficialChan) score += 40;

  // Year bonus
  if (title.includes(String(movie.releaseYear))) score += 20;

  // If searching for Hindi dubbed version of non-Hindi film
  if (isSearchingHindi && movie.language !== "Hindi") {
    if (isHindiTrailer(cand, movie)) {
      score += 40;
    } else {
      score -= 50; // reject non-hindi when searching for hindi
    }
  }

  return score;
}

async function auditSingleMovie(movie) {
  console.log(`\n--------------------------------------------------`);
  console.log(`[${movie.idx}/228] Auditing [ID: ${movie.id}] "${movie.title}" (${movie.releaseYear}, ${movie.language})`);

  let bestHindiCandidate = null;
  let bestOriginalCandidate = null;

  // 1. If Hindi movie: search official trailer
  if (movie.language === "Hindi") {
    const queries = [
      `"${movie.title}" ${movie.releaseYear} official trailer`,
      `"${movie.title}" official trailer ${movie.director}`,
      `"${movie.title}" official trailer`,
    ];

    let candidates = [];
    for (const q of queries) {
      const results = await searchYouTube(q);
      for (const res of results) {
        const sc = scoreCandidate(res, movie, false);
        if (sc > 30) {
          candidates.push({ ...res, score: sc, query: q });
        }
      }
      if (candidates.length > 0) break;
      await new Promise(r => setTimeout(r, 400));
    }

    candidates.sort((a, b) => b.score - a.score);
    if (candidates.length > 0) {
      const top = candidates[0];
      const oe = await getOEmbed(top.videoId);
      bestHindiCandidate = {
        videoId: top.videoId,
        title: oe ? oe.title : top.title,
        channel: oe ? oe.author_name : top.channel,
        trailerLanguage: "Hindi",
        hindiAvailable: true,
        verificationStatus: "Verified Official Hindi",
        score: top.score,
      };
    }
  } else {
    // 2. Non-Hindi movie: Priority 1 - Search for Official Hindi Dubbed Trailer
    const hindiQueries = [
      `"${movie.title}" ${movie.releaseYear} official hindi trailer`,
      `"${movie.title}" official hindi trailer`,
      `"${movie.title}" hindi dubbed trailer`,
      `"${movie.title}" hindi trailer`,
    ];

    let hindiCandidates = [];
    for (const q of hindiQueries) {
      const results = await searchYouTube(q);
      for (const res of results) {
        const sc = scoreCandidate(res, movie, true);
        if (sc > 40 && isHindiTrailer(res, movie)) {
          hindiCandidates.push({ ...res, score: sc, query: q });
        }
      }
      if (hindiCandidates.length > 0) break;
      await new Promise(r => setTimeout(r, 400));
    }

    hindiCandidates.sort((a, b) => b.score - a.score);
    if (hindiCandidates.length > 0) {
      const top = hindiCandidates[0];
      const oe = await getOEmbed(top.videoId);
      bestHindiCandidate = {
        videoId: top.videoId,
        title: oe ? oe.title : top.title,
        channel: oe ? oe.author_name : top.channel,
        trailerLanguage: "Hindi",
        hindiAvailable: true,
        verificationStatus: "Verified Official Hindi",
        score: top.score,
      };
    }

    // 3. If no Hindi candidate, find Official Original-Language Trailer
    if (!bestHindiCandidate) {
      const origQueries = [
        `"${movie.title}" ${movie.releaseYear} official trailer`,
        `"${movie.title}" official trailer ${movie.language}`,
        `"${movie.title}" official trailer ${movie.director}`,
        `"${movie.title}" official trailer`,
      ];

      let origCandidates = [];
      for (const q of origQueries) {
        const results = await searchYouTube(q);
        for (const res of results) {
          const sc = scoreCandidate(res, movie, false);
          if (sc > 20) {
            origCandidates.push({ ...res, score: sc, query: q });
          }
        }
        if (origCandidates.length > 0) break;
        await new Promise(r => setTimeout(r, 400));
      }

      origCandidates.sort((a, b) => b.score - a.score);
      if (origCandidates.length > 0) {
        const top = origCandidates[0];
        const oe = await getOEmbed(top.videoId);
        bestOriginalCandidate = {
          videoId: top.videoId,
          title: oe ? oe.title : top.title,
          channel: oe ? oe.author_name : top.channel,
          trailerLanguage: `Original (${movie.language})`,
          hindiAvailable: false,
          verificationStatus: "Verified Official Original (Hindi Unavailable)",
          score: top.score,
        };
      }
    }
  }

  const chosen = bestHindiCandidate || bestOriginalCandidate || {
    videoId: null,
    title: null,
    channel: null,
    trailerLanguage: "None",
    hindiAvailable: false,
    verificationStatus: "Unavailable Official Trailer",
    score: 0,
  };

  console.log(`=> Result: ${chosen.verificationStatus} | ID: ${chosen.videoId || "NONE"} | Lang: ${chosen.trailerLanguage} | Channel: "${chosen.channel || "N/A"}" | Title: "${chosen.title || "N/A"}"`);

  auditDb[movie.id] = {
    idx: movie.idx,
    id: movie.id,
    slug: movie.slug,
    title: movie.title,
    releaseYear: movie.releaseYear,
    language: movie.language,
    industry: movie.industry,
    director: movie.director,
    trailerYoutubeId: chosen.videoId,
    trailerUrl: chosen.videoId ? `https://www.youtube.com/watch?v=${chosen.videoId}` : null,
    trailerTitle: chosen.title,
    trailerChannel: chosen.channel,
    trailerLanguage: chosen.trailerLanguage,
    hindiAvailable: chosen.hindiAvailable,
    verificationStatus: chosen.verificationStatus,
  };

  fs.writeFileSync(auditFilePath, JSON.stringify(auditDb, null, 2));
}

async function run() {
  const args = process.argv.slice(2);
  let startIdx = 1;
  let endIdx = 228;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === "--start") startIdx = parseInt(args[i + 1], 10);
    if (args[i] === "--end") endIdx = parseInt(args[i + 1], 10);
  }

  console.log(`Starting Batch Audit from movie index ${startIdx} to ${endIdx}...`);

  for (let i = startIdx - 1; i < endIdx && i < moviesList.length; i++) {
    await auditSingleMovie(moviesList[i]);
    await new Promise(r => setTimeout(r, 600));
  }

  console.log(`\nAudit batch complete! Saved to ${auditFilePath}`);
}

run();
