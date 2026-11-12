// scripts/test_eval_score.cjs
const cand = {
  title: "RRR Official Trailer (Hindi) India’s Biggest Action Drama | NTR,RamCharan,AjayD,AliaB | SS Rajamouli",
  channel: "Pen Movies",
  length: "3:16"
};
const movie = {
  title: "RRR",
  releaseYear: 2022,
  language: "Telugu"
};

function normalizeTitle(t) {
  return t.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
}
function parseDurationSeconds(lenStr) {
  if (!lenStr) return 120;
  const parts = lenStr.split(":").map(Number);
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  return 120;
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

  console.log("dur:", dur);
  if (isJunk(title)) return { score: -100, step: "junk" };
  if (dur < 25 || dur > 420) return { score: -100, step: "dur" };

  const normMovie = normalizeTitle(movie.title);
  const normCand = normalizeTitle(cand.title);

  // Sequel mismatch check
  if (!normMovie.includes("2") && !normMovie.includes("two") && !normMovie.includes("part 2") && !normMovie.includes("chapter 2")) {
    if (normCand.includes(" 2 ") || normCand.includes("part 2") || normCand.includes("chapter 2") || normCand.includes("returns")) {
      return { score: -100, step: "sequel 2" };
    }
  }
  if (!normMovie.includes("3") && !normMovie.includes("three")) {
    if (normCand.includes(" 3 ") || normCand.includes("part 3") || normCand.includes("chapter 3")) {
      return { score: -100, step: "sequel 3" };
    }
  }

  // Core words match
  const movieWords = normMovie.split(" ").filter(w => w.length > 2 && w !== "the" && w !== "part" && w !== "chapter");
  const matchedWords = movieWords.filter(w => normCand.includes(w));
  console.log("matchedWords:", matchedWords);
  if (movieWords.length > 0 && matchedWords.length / movieWords.length < 0.5) {
    return { score: -50, step: "matchedWords" };
  }

  let score = matchedWords.length * 20;

  if (title.includes("trailer")) score += 35;
  else if (title.includes("teaser")) score += 10;
  else return { score: -50, step: "no trailer" };

  if (title.includes("official")) score += 15;

  const isOfficial = OFFICIAL_CHANNELS.some(c => channel.includes(c));
  if (isOfficial) score += 40;

  if (title.includes(String(movie.releaseYear))) score += 15;

  const isHindi = isHindiTrailer(cand, movie);

  return { score, isHindi, isOfficial };
}

console.log(evaluateCandidate(cand, movie));
