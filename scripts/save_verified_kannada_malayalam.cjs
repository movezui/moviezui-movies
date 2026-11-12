// scripts/save_verified_kannada_malayalam.cjs
const fs = require("fs");
const path = require("path");

const verifiedList = [
  // Kannada
  { slug: "kgf-chapter-1", id: "-KfsY-qwBS0", lang: "Hindi", isHindi: true },
  { slug: "kgf-chapter-2", id: "JKa05nyUmuQ", lang: "Hindi", isHindi: true },
  { slug: "kantara", id: "MTECjlKUgEE", lang: "Hindi", isHindi: true },
  { slug: "777-charlie", id: "lzr2PJXeHww", lang: "Hindi", isHindi: true },
  { slug: "ulidavaru-kandanthe", id: "POJ_6EtGeMw", lang: "Original (Kannada)", isHindi: false },
  { slug: "lucia", id: "pgIL2H-OdcA", lang: "Original (Kannada)", isHindi: false },
  { slug: "kirik-party", id: "IfvnbER_6sQ", lang: "Original (Kannada)", isHindi: false },
  { slug: "gandhadagudi", id: "UdPisHeGMQM", lang: "Original (Kannada)", isHindi: false },
  { slug: "sapta-saagaradaache-ello-side-a", id: "hcJ1ZHHahMA", lang: "Original (Kannada)", isHindi: false },
  { slug: "sapta-saagaradaache-ello-side-b", id: "llKjFW1gv0M", lang: "Original (Kannada)", isHindi: false },
  { slug: "garuda-gamana-vrishabha-vahana", id: "BnuDHJcSd0Q", lang: "Original (Kannada)", isHindi: false },
  { slug: "tagaru", id: null, lang: "None", isHindi: false },
  { slug: "dia-kannada", id: "8GR-W0jGVak", lang: "Original (Kannada)", isHindi: false },
  { slug: "kavaludaari", id: "5w1vgMoPMRA", lang: "Original (Kannada)", isHindi: false },
  { slug: "bell-bottom-kannada", id: "0_W_PhKaQaY", lang: "Original (Kannada)", isHindi: false },
  { slug: "daredevil-musthafa", id: "obRgGKDFN0A", lang: "Original (Kannada)", isHindi: false },

  // Malayalam
  { slug: "drishyam-malayalam", id: "eMASubc1y_k", lang: "Original (Malayalam)", isHindi: false },
  { slug: "kumbalangi-nights", id: "3P4BFBSafF0", lang: "Original (Malayalam)", isHindi: false },
  { slug: "premam", id: "tRQeIsxaBkg", lang: "Original (Malayalam)", isHindi: false },
  { slug: "bangalore-days", id: "uVpHL5g4buY", lang: "Original (Malayalam)", isHindi: false },
  { slug: "manjummel-boys", id: "rqBuKT_8dMY", lang: "Original (Malayalam)", isHindi: false },
  { slug: "aavesham", id: "L0yEMl8PXnw", lang: "Original (Malayalam)", isHindi: false },
  { slug: "the-great-indian-kitchen", id: "k_E6ctiFn6I", lang: "Original (Malayalam)", isHindi: false },
  { slug: "lucifer-malayalam", id: "x1-Ya0NZQso", lang: "Original (Malayalam)", isHindi: false },
  { slug: "bramayugam", id: "55pzldrBRJM", lang: "Original (Malayalam)", isHindi: false },
  { slug: "minnal-murali", id: "Vctn-pq6MEs", lang: "Hindi", isHindi: true },
  { slug: "ustad-hotel", id: "rhfVeDnd7-M", lang: "Original (Malayalam)", isHindi: false },
  { slug: "joji", id: "9yULZ8y1J-s", lang: "Original (Malayalam)", isHindi: false },
  { slug: "premalu", id: "rR_2ti4l3nM", lang: "Original (Malayalam)", isHindi: false },
  { slug: "neru", id: "abuLOH7xs8I", lang: "Original (Malayalam)", isHindi: false },
  { slug: "kaathal-the-core", id: "uc0kllY_Rgo", lang: "Original (Malayalam)", isHindi: false },
  { slug: "kishkindha-kaandam", id: "flP_if0RZF4", lang: "Hindi", isHindi: true },
  { slug: "thondimuthalum-driksakshiyum", id: "f2zG7g4AVoQ", lang: "Original (Malayalam)", isHindi: false },
  { slug: "maheshinte-prathikaaram", id: "_KY8Du4WWew", lang: "Original (Malayalam)", isHindi: false },
  { slug: "virus-malayalam", id: "38MijVTyP7s", lang: "Original (Malayalam)", isHindi: false },
  { slug: "take-off-malayalam", id: "vzYSKjxtKNg", lang: "Original (Malayalam)", isHindi: false },
  { slug: "iratta", id: "OIMILWxADV0", lang: "Original (Malayalam)", isHindi: false },
  { slug: "romancham", id: "0WR621Z3AIM", lang: "Hindi", isHindi: true },
];

const list = JSON.parse(fs.readFileSync(path.join(__dirname, "movies_list.json"), "utf8"));

async function run() {
  const finalResults = [];
  for (const item of verifiedList) {
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
      console.log(`[OK] ${movie.title} -> ${item.id} | ${data.author_name} | ${data.title}`);
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
      console.log(`[UNAVAILABLE] ${movie.title} -> No official trailer available`);
    }
  }

  fs.writeFileSync(path.join(__dirname, "verified_kannada_malayalam.json"), JSON.stringify(finalResults, null, 2));
  console.log(`\nSuccessfully verified and saved all ${finalResults.length} Kannada and Malayalam movies!`);
}

run();
