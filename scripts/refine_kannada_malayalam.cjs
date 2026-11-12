// scripts/refine_kannada_malayalam.cjs
const fs = require("fs");
const path = require("path");

async function getOEmbed(videoId) {
  if (!videoId) return null;
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

const queries = [
  // Kantara Hindi
  { slug: "kantara-2022", query: "Kantara Hindi trailer Hombale Films", lang: "Hindi" },
  // 777 Charlie Hindi
  { slug: "777-charlie-2022", query: "777 Charlie Hindi trailer Rakshit Shetty", lang: "Hindi" },
  // Kumbalangi Nights
  { slug: "kumbalangi-nights-2019", query: "Kumbalangi Nights official trailer Fahadh Faasil", lang: "Original (Malayalam)" },
  // Premam
  { slug: "premam-2015", query: "Premam official trailer Nivin Pauly Alphonse Puthren", lang: "Original (Malayalam)" },
  // Bangalore Days
  { slug: "bangalore-days-2014", query: "Bangalore Days official trailer Dulquer Salmaan Nivin Pauly", lang: "Original (Malayalam)" },
  // Manjummel Boys Hindi
  { slug: "manjummel-boys-2024", query: "Manjummel Boys Hindi trailer Hotstar", lang: "Hindi" },
  // Ustad Hotel
  { slug: "ustad-hotel-2012", query: "Ustad Hotel official trailer Dulquer Salmaan", lang: "Original (Malayalam)" },
  // Premalu Hindi
  { slug: "premalu-2024", query: "Premalu Hindi trailer Disney Plus Hotstar", lang: "Hindi" },
  // Kishkindha Kaandam
  { slug: "kishkindha-kaandam-2024", query: "Kishkindha Kaandam official trailer Asif Ali Goodwill", lang: "Original (Malayalam)" },
  // Romancham
  { slug: "romancham-2023", query: "Romancham official trailer Soubin Shahir Goodwill", lang: "Original (Malayalam)" },
  // Sapta Saagaradaache Ello Side A
  { slug: "sapta-saagaradaache-ello-side-a-2023", query: "Sapta Saagaradaache Ello Side A official trailer Rakshit Shetty Paramvah", lang: "Original (Kannada)" },
  // Sapta Saagaradaache Ello Side B
  { slug: "sapta-saagaradaache-ello-side-b-2023", query: "Sapta Saagaradaache Ello Side B official trailer Rakshit Shetty Paramvah", lang: "Original (Kannada)" },
  // Garuda Gamana Vrishabha Vahana
  { slug: "garuda-gamana-vrishabha-vahana-2021", query: "Garuda Gamana Vrishabha Vahana official trailer Raj B Shetty Rishab", lang: "Original (Kannada)" },
  // Tagaru
  { slug: "tagaru-2018", query: "Tagaru official trailer Shivarajkumar PRK Audio", lang: "Original (Kannada)" },
  // Dia
  { slug: "dia-2020", query: "Dia official trailer Kannada movie Anand Audio", lang: "Original (Kannada)" },
  // Kavaludaari
  { slug: "kavaludaari-2019", query: "Kavaludaari official trailer PRK Audio", lang: "Original (Kannada)" },
  // Bell Bottom
  { slug: "bell-bottom-2019", query: "Bell Bottom official trailer Rishab Shetty Hariprriya", lang: "Original (Kannada)" },
  // Daredevil Musthafa
  { slug: "daredevil-musthafa-2023", query: "Daredevil Musthafa official trailer KRG Studios", lang: "Original (Kannada)" }
];

async function run() {
  for (const item of queries) {
    console.log(`\nSearching for ${item.slug} (${item.query})...`);
    const results = await searchYT(item.query);
    for (let i = 0; i < Math.min(5, results.length); i++) {
      const r = results[i];
      const oe = await getOEmbed(r.id);
      console.log(`  [${i}] ID: ${r.id} | Chan: "${oe?.author_name || r.channel}" | Title: "${oe?.title || r.title}"`);
    }
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
