// scripts/test_smart_audit.cjs
const fs = require("fs");

async function getOEmbed(videoId) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`, {
      signal: AbortSignal.timeout(4000)
    });
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
      signal: AbortSignal.timeout(6000),
    });
    if (!res.ok) return [];
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
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
  "zen music", "brainbox studios", "rajshri", "times music", "tips", "rottentomatoes", "movieclips"
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

function evaluateCandidate(cand, movie) {
  const title = cand.title.toLowerCase();
  const channel = cand.channel.toLowerCase();
  const dur = parseDurationSeconds(cand.length);

  if (isJunk(title)) return { score: -100 };
  if (dur < 25 || dur > 420) return { score: -100 };

  const normMovie = normalizeTitle(movie.title);
  const normCand = normalizeTitle(cand.title);

  // Sequel mismatch check
  if (!normMovie.includes("2") && !normMovie.includes("two") && !normMovie.includes("part 2") && !normMovie.includes("chapter 2")) {
    if (normCand.includes(" 2 ") || normCand.includes("part 2") || normCand.includes("chapter 2") || normCand.includes("returns")) {
      return { score: -100 };
    }
  }
  if (!normMovie.includes("3") && !normMovie.includes("three")) {
    if (normCand.includes(" 3 ") || normCand.includes("part 3") || normCand.includes("chapter 3")) {
      return { score: -100 };
    }
  }

  // Core words match
  const movieWords = normMovie.split(" ").filter(w => w.length > 2 && w !== "the" && w !== "part" && w !== "chapter");
  const matchedWords = movieWords.filter(w => normCand.includes(w));
  if (movieWords.length > 0 && matchedWords.length / movieWords.length < 0.5) {
    return { score: -50 };
  }

  let score = matchedWords.length * 20;

  if (title.includes("trailer")) score += 35;
  else if (title.includes("teaser")) score += 10;
  else return { score: -50 };

  if (title.includes("official")) score += 15;

  const isOfficial = OFFICIAL_CHANNELS.some(c => channel.includes(c));
  if (isOfficial) score += 40;

  if (title.includes(String(movie.releaseYear))) score += 15;

  const isHindi = isHindiTrailer(cand, movie);

  return { score, isHindi, isOfficial };
}

async function smartAuditMovie(movie) {
  // If non-Hindi, search both general trailer and specific Hindi query if needed
  let results = [];
  
  if (movie.language === "Hindi") {
    results = await searchYouTube(`"${movie.title}" ${movie.releaseYear} official trailer`);
  } else {
    // For non-Hindi: first search Hindi trailer to find Hindi dubs if any!
    const hindiSearch = await searchYouTube(`"${movie.title}" ${movie.releaseYear} Hindi trailer`);
    results = hindiSearch;
    
    // Check if any genuine Hindi trailer in hindiSearch
    let foundHindi = false;
    for (const r of hindiSearch) {
      const ev = evaluateCandidate(r, movie);
      if (ev.score > 40 && ev.isHindi) {
        foundHindi = true;
        break;
      }
    }
    
    // If no Hindi trailer found, do general trailer search for original language
    if (!foundHindi) {
      await new Promise(r => setTimeout(r, 600));
      const origSearch = await searchYouTube(`"${movie.title}" ${movie.releaseYear} official trailer`);
      results = results.concat(origSearch);
    }
  }

  let hindiCandidates = [];
  let origCandidates = [];

  for (const r of results) {
    const ev = evaluateCandidate(r, movie);
    if (ev.score > 25) {
      if (ev.isHindi) {
        hindiCandidates.push({ ...r, ...ev });
      } else {
        origCandidates.push({ ...r, ...ev });
      }
    }
  }

  hindiCandidates.sort((a, b) => b.score - a.score);
  origCandidates.sort((a, b) => b.score - a.score);

  if (hindiCandidates.length > 0) {
    const top = hindiCandidates[0];
    const oe = await getOEmbed(top.videoId);
    return {
      videoId: top.videoId,
      title: oe ? oe.title : top.title,
      channel: oe ? oe.author_name : top.channel,
      trailerLanguage: "Hindi",
      hindiAvailable: true,
      verificationStatus: "Verified Official Hindi",
    };
  }

  if (origCandidates.length > 0) {
    const top = origCandidates[0];
    const oe = await getOEmbed(top.videoId);
    return {
      videoId: top.videoId,
      title: oe ? oe.title : top.title,
      channel: oe ? oe.author_name : top.channel,
      trailerLanguage: `Original (${movie.language})`,
      hindiAvailable: false,
      verificationStatus: "Verified Official Original (Hindi Unavailable)",
    };
  }

  return {
    videoId: null,
    title: null,
    channel: null,
    trailerLanguage: "None",
    hindiAvailable: false,
    verificationStatus: "Unavailable Official Trailer",
  };
}

async function run() {
  const sample = [
    { id: "1", title: "Hellaro", releaseYear: 2019, language: "Gujarati" },
    { id: "2", title: "Chhello Divas", releaseYear: 2015, language: "Gujarati" },
    { id: "21", title: "3 Idiots", releaseYear: 2009, language: "Hindi" },
    { id: "22", title: "Dangal", releaseYear: 2016, language: "Hindi" },
    { id: "42", title: "The Dark Knight", releaseYear: 2008, language: "English" },
    { id: "52", title: "Avengers: Endgame", releaseYear: 2019, language: "English" },
    { id: "73", title: "RRR", releaseYear: 2022, language: "Telugu" },
    { id: "74", title: "Baahubali: The Beginning", releaseYear: 2015, language: "Telugu" },
    { id: "97", title: "K.G.F: Chapter 1", releaseYear: 2018, language: "Kannada" },
    { id: "101", title: "Kantara", releaseYear: 2022, language: "Kannada" },
  ];

  for (const m of sample) {
    const res = await smartAuditMovie(m);
    console.log(`[${m.id}] "${m.title}" (${m.releaseYear}, ${m.language})`);
    console.log(`  => Status: ${res.verificationStatus} | Lang: ${res.trailerLanguage}`);
    console.log(`  => ID: ${res.videoId} | Channel: "${res.channel}"`);
    console.log(`  => Title: "${res.title}"\n`);
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
