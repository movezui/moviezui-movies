// scripts/test_search_details.cjs
async function searchYT(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });
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
}

async function test() {
  const list = [
    "Sapta Saagaradaache Ello Side A trailer",
    "Sapta Saagaradaache Ello Side B trailer",
    "Garuda Gamana Vrishabha Vahana trailer",
    "Tagaru Kannada trailer",
    "Dia Kannada movie trailer",
    "Kavaludaari trailer PRK Audio",
    "Bell Bottom Kannada trailer",
    "Daredevil Musthafa trailer",
    "Romancham Malayalam trailer",
    "Kishkindha Kaandam trailer Asif Ali",
    "Premalu official trailer Bhavana Studios",
    "Manjummel Boys official trailer"
  ];
  for (const q of list) {
    const res = await searchYT(q);
    console.log(`\nQuery: "${q}" -> found ${res.length} videos`);
    for (const r of res.slice(0, 3)) {
      console.log(`  - [${r.id}] (${r.channel}): ${r.title}`);
    }
    await new Promise(r => setTimeout(r, 500));
  }
}
test();
