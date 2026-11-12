// scripts/check_specific_channels.cjs
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

async function run() {
  const tests = [
    "criterion Charulata",
    "Bhooter Bhabishyat official trailer",
    "Chaar Sahibzaade 2014 trailer Baweja",
    "Kaksparsh trailer Great Maratha",
    "Elizabeth Ekadashi trailer Zee",
    "Windows Belaseshe trailer Soumitra",
    "Eros Now Chaar Sahibzaade trailer 2014"
  ];
  for (const t of tests) {
    console.log(`\nTesting: "${t}"`);
    const res = await searchYT(t);
    for (const r of res.slice(0, 3)) {
      console.log(`  [${r.id}] ${r.channel} : ${r.title}`);
    }
  }
}
run();
