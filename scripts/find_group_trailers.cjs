// scripts/find_group_trailers.cjs
const fs = require("fs");
const path = require("path");

async function searchYT(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
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
          title: c.videoRenderer.title?.runs?.map(r => r.text).join("") || "",
          channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join("") || "",
        });
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

async function getOEmbed(id) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

const targets = [
  // International & Regional
  { slug: "daman-odia", query: "DAMaN Hindi trailer Panorama Studios" },
  { slug: "spirited-away", query: "Spirited Away official trailer GKIDS" },
  { slug: "drive-my-car", query: "Drive My Car official trailer Janus Films" },
  { slug: "parasite", query: "Parasite official trailer NEON" },
  { slug: "anatomy-of-a-fall", query: "Anatomy of a Fall official trailer NEON" },
  { slug: "the-zone-of-interest", query: "The Zone of Interest official trailer A24" },
  { slug: "village-rockstars", query: "Village Rockstars official trailer Rima Das" },

  // Punjabi
  { slug: "carry-on-jatta", query: "Speed Records Carry On Jatta official trailer 2012 Gippy" },
  { slug: "qismat", query: "Speed Records Qismat official trailer Ammy Virk Sargun" },
  { slug: "angrej", query: "Rhythm Boyz Angrej official trailer Amrinder Gill" },
  { slug: "jatt-and-juliet", query: "Speed Records Jatt and Juliet official trailer Diljit Dosanjh" },
  { slug: "ardaas", query: "Speed Records Ardaas official trailer Gippy Grewal Ammy Virk" },
  { slug: "chaar-sahibzaade", query: "Eros Now Chaar Sahibzaade official trailer Hindi" },
  { slug: "sufna", query: "Panj-aab Records Sufna official trailer Ammy Virk" },
  { slug: "kali-jotta", query: "Times Music Kali Jotta official trailer Neeru Bajwa Satinder Sartaaj" },
  { slug: "bambukat", query: "Rhythm Boyz Bambukat official trailer Ammy Virk" },
  { slug: "rabb-da-radio", query: "White Hill Music Rabb Da Radio official trailer Tarsem Jassar" },
  { slug: "nikka-zaildar", query: "Speed Records Nikka Zaildar official trailer Ammy Virk Sonam" },
  { slug: "warning-punjabi", query: "SagaHits Warning official trailer Gippy Grewal" },
  { slug: "jodi", query: "Rhythm Boyz Jodi official trailer Diljit Dosanjh Nimrat" },
  { slug: "chal-mera-putt", query: "Rhythm Boyz Chal Mera Putt official trailer Amrinder Gill" },

  // Marathi
  { slug: "sairat", query: "Zee Studios Sairat official trailer Nagraj Manjule" },
  { slug: "court-marathi", query: "Court official trailer Chaitanya Tamhane" },
  { slug: "natsamrat", query: "Zee Studios Natsamrat official trailer Nana Patekar" },
  { slug: "killa", query: "Zee Studios Killa official trailer Avinash Arun" },
  { slug: "harishchandrachi-factory", query: "UTV Motion Pictures Harishchandrachi Factory trailer" },
  { slug: "baaplyok", query: "Baaplyok official trailer Nagraj Manjule" },
  { slug: "natrang", query: "Zee Talkies Natrang official trailer Atul Kulkarni" },
  { slug: "kaksparsh", query: "Kaksparsh official trailer Mahesh Manjrekar" },
  { slug: "fandry", query: "Zee Studios Fandry official trailer Nagraj Manjule" },
  { slug: "elizabeth-ekadashi", query: "Zee Studios Elizabeth Ekadashi official trailer" },
  { slug: "katyar-kaljat-ghusali", query: "Zee Studios Katyar Kaljat Ghusali official trailer" },
  { slug: "anandi-gopal", query: "Zee Studios Anandi Gopal official trailer" },
  { slug: "jhimma", query: "Jhimma official trailer Hemant Dhome" },
  { slug: "vaalvi", query: "Zee Studios Vaalvi official trailer Swapnil Joshi" },

  // Bengali
  { slug: "pather-panchali", query: "Pather Panchali Janus Films official trailer" },
  { slug: "charulata", query: "Charulata Janus Films official trailer" },
  { slug: "apur-sansar", query: "Apur Sansar Janus Films official trailer" },
  { slug: "aparajito", query: "Aparajito 1956 Janus Films trailer" },
  { slug: "baishe-srabon", query: "SVF Baishe Srabon official trailer Srijit Mukherji" },
  { slug: "bhooter-bhabishyat", query: "Bhooter Bhabishyat official trailer Anik Dutta" },
  { slug: "belaseshe", query: "Windows Productions Belaseshe official trailer" },
  { slug: "nagarkirtan", query: "Nagarkirtan official trailer Riddhi Sen" },
  { slug: "jaatishwar", query: "SVF Jaatishwar official trailer Prosenjit" },
  { slug: "chotushkone", query: "SVF Chotushkone official trailer Srijit Mukherji" },
  { slug: "ballabhpurer-roopkotha", query: "SVF Ballabhpurer Roopkotha official trailer" },
  { slug: "dostojee", query: "Dostojee official trailer Prasun Chatterjee" },
  { slug: "aparajito-2022", query: "Friends Communication Aparajito official trailer Anik Dutta" },
  { slug: "goynar-baksho", query: "SVF Goynar Baksho official trailer Aparna Sen" },
];

async function run() {
  const results = {};
  for (let i = 0; i < targets.length; i++) {
    const t = targets[i];
    console.log(`[${i + 1}/${targets.length}] Searching: ${t.slug} -> "${t.query}"`);
    const res = await searchYT(t.query);
    results[t.slug] = [];
    for (const r of res.slice(0, 3)) {
      const oe = await getOEmbed(r.id);
      results[t.slug].push({
        id: r.id,
        title: oe?.title || r.title,
        channel: oe?.author_name || r.channel,
      });
      console.log(`   [${r.id}] ${oe?.author_name || r.channel} | ${oe?.title || r.title}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }

  fs.writeFileSync(path.join(__dirname, "found_group_trailers.json"), JSON.stringify(results, null, 2));
  console.log("\nDone! Saved to scripts/found_group_trailers.json");
}

run();
