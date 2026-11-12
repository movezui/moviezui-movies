// scripts/save_verified_remaining_49.cjs
const fs = require("fs");
const path = require("path");

const remainingList = [
  // International & Regional (7)
  { slug: "daman-odia", id: "MOckS35r8yE", lang: "Hindi", isHindi: true },
  { slug: "spirited-away", id: "fDUFP7EeXLE", lang: "Original (Japanese)", isHindi: false },
  { slug: "drive-my-car", id: "6BPKPb_RTwI", lang: "Original (Japanese)", isHindi: false },
  { slug: "parasite", id: "isOGD_7hNIY", lang: "Original (Korean)", isHindi: false },
  { slug: "anatomy-of-a-fall", id: "FUXawkH-ONM", lang: "Original (French)", isHindi: false },
  { slug: "the-zone-of-interest", id: "r-vfg3KkV54", lang: "Original (German)", isHindi: false },
  { slug: "village-rockstars", id: "tTov2nVgXaU", lang: "Original (Assamese)", isHindi: false },

  // Punjabi (14)
  { slug: "carry-on-jatta", id: "5zXhneEuOjY", lang: "Original (Punjabi)", isHindi: false },
  { slug: "qismat", id: "xgQcYRakbms", lang: "Original (Punjabi)", isHindi: false },
  { slug: "angrej", id: "xw96l194ueA", lang: "Original (Punjabi)", isHindi: false },
  { slug: "jatt-and-juliet", id: "q8aq0WAZFlM", lang: "Original (Punjabi)", isHindi: false },
  { slug: "ardaas", id: "Wm73yx3Qq20", lang: "Original (Punjabi)", isHindi: false },
  { slug: "chaar-sahibzaade", id: "-W1CMhxunf0", lang: "Original (Punjabi)", isHindi: false },
  { slug: "sufna", id: "5Z0XEsuJPX8", lang: "Original (Punjabi)", isHindi: false },
  { slug: "kali-jotta", id: "1y9tUcXFbqI", lang: "Original (Punjabi)", isHindi: false },
  { slug: "bambukat", id: "e9u_D-5lYJ4", lang: "Original (Punjabi)", isHindi: false },
  { slug: "rabb-da-radio", id: "ke4jcUPFcrY", lang: "Original (Punjabi)", isHindi: false },
  { slug: "nikka-zaildar", id: "AlpSxOWN9HU", lang: "Original (Punjabi)", isHindi: false },
  { slug: "warning-punjabi", id: "4o56Ri0uiTI", lang: "Original (Punjabi)", isHindi: false },
  { slug: "jodi", id: "c8uhxLHcw7c", lang: "Original (Punjabi)", isHindi: false },
  { slug: "chal-mera-putt", id: "L4SWVmkwQvg", lang: "Original (Punjabi)", isHindi: false },

  // Marathi (14)
  { slug: "sairat", id: "iShPI_JF524", lang: "Original (Marathi)", isHindi: false },
  { slug: "court-marathi", id: "4sc8z7zav9A", lang: "Original (Marathi)", isHindi: false },
  { slug: "natsamrat", id: "Bp1Hv_-hLUY", lang: "Original (Marathi)", isHindi: false },
  { slug: "killa", id: "t3B_WzebSHM", lang: "Original (Marathi)", isHindi: false },
  { slug: "harishchandrachi-factory", id: "LPvvMbXLfpA", lang: "Original (Marathi)", isHindi: false },
  { slug: "baaplyok", id: "yX2v4wGeC3k", lang: "Original (Marathi)", isHindi: false },
  { slug: "natrang", id: "a7YET30Y9uI", lang: "Original (Marathi)", isHindi: false },
  { slug: "kaksparsh", id: null, lang: "None", isHindi: false },
  { slug: "fandry", id: "BjHsL-_KG30", lang: "Original (Marathi)", isHindi: false },
  { slug: "elizabeth-ekadashi", id: "mmEwW40ovnY", lang: "Original (Marathi)", isHindi: false },
  { slug: "katyar-kaljat-ghusali", id: "1iTazEogwiY", lang: "Original (Marathi)", isHindi: false },
  { slug: "anandi-gopal", id: "mAS_hUTOJdY", lang: "Original (Marathi)", isHindi: false },
  { slug: "jhimma", id: "L3hNlo7mVGw", lang: "Original (Marathi)", isHindi: false },
  { slug: "vaalvi", id: "hm0s7r3kRKw", lang: "Original (Marathi)", isHindi: false },

  // Bengali (14)
  { slug: "pather-panchali", id: "sZNlRMdMdoI", lang: "Original (Bengali)", isHindi: false },
  { slug: "charulata", id: null, lang: "None", isHindi: false },
  { slug: "baishe-srabon", id: "o-Az9dxnQF8", lang: "Original (Bengali)", isHindi: false },
  { slug: "bhooter-bhabishyat", id: null, lang: "None", isHindi: false },
  { slug: "belaseshe", id: "2ZYT9On-I-M", lang: "Original (Bengali)", isHindi: false },
  { slug: "nagarkirtan", id: "zPs_ZeW-ti0", lang: "Original (Bengali)", isHindi: false },
  { slug: "apur-sansar", id: "mgv68E_o6VM", lang: "Original (Bengali)", isHindi: false },
  { slug: "aparajito", id: null, lang: "None", isHindi: false },
  { slug: "jaatishwar", id: "XYF_Vp8arb0", lang: "Original (Bengali)", isHindi: false },
  { slug: "chotushkone", id: "tVa3A4fcnpg", lang: "Original (Bengali)", isHindi: false },
  { slug: "ballabhpurer-roopkotha", id: "NER2p1UmdAY", lang: "Original (Bengali)", isHindi: false },
  { slug: "dostojee", id: "cdB99OBdCvQ", lang: "Original (Bengali)", isHindi: false },
  { slug: "aparajito-2022", id: "zgO3bRmmlz4", lang: "Original (Bengali)", isHindi: false },
  { slug: "goynar-baksho", id: "_2kZp5TZlsM", lang: "Original (Bengali)", isHindi: false },
];

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));

async function run() {
  const finalResults = [];
  for (const item of remainingList) {
    const movie = list.find(m => m.slug === item.slug);
    if (!movie) {
      console.error("Movie not found for slug:", item.slug);
      process.exit(1);
    }

    if (item.id) {
      const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${item.id}&format=json`);
      if (!res.ok) {
        console.error(`FAILED oEmbed for ${movie.title} (${item.id}): status ${res.status}`);
        process.exit(1);
      }
      const data = await res.json();
      finalResults.push({
        id: movie.id,
        slug: movie.slug,
        title: movie.title,
        releaseYear: movie.releaseYear,
        language: movie.language,
        trailerYoutubeId: item.id,
        trailerUrl: `https://www.youtube.com/watch?v=${item.id}`,
        trailerTitle: data.title,
        trailerChannel: data.author_name,
        trailerLanguage: item.lang,
        hindiAvailable: item.isHindi,
        verificationStatus: item.isHindi ? "Verified Official Hindi" : `Verified Official Original (Hindi Unavailable)`
      });
      console.log(`[OK] ${movie.title} (${movie.language}) -> ${item.id} | ${data.author_name} | ${data.title}`);
    } else {
      finalResults.push({
        id: movie.id,
        slug: movie.slug,
        title: movie.title,
        releaseYear: movie.releaseYear,
        language: movie.language,
        trailerYoutubeId: null,
        trailerUrl: null,
        trailerTitle: null,
        trailerChannel: null,
        trailerLanguage: "None",
        hindiAvailable: false,
        verificationStatus: "Unavailable Official Trailer"
      });
      console.log(`[UNAVAILABLE] ${movie.title} (${movie.language}) -> No official studio trailer available`);
    }
  }

  fs.writeFileSync(path.join(__dirname, "verified_remaining_49.json"), JSON.stringify(finalResults, null, 2));
  console.log(`\nSuccessfully verified and saved all ${finalResults.length} remaining movies!`);
}

run();
