// scripts/check_apu_separate.cjs
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

async function run() {
  const q1 = await searchYT("Aparajito 1956 trailer Satyajit Ray");
  console.log("Aparajito 1956:");
  for (const r of q1.slice(0, 5)) {
    console.log(`  [${r.id}] ${r.channel} : ${r.title}`);
  }
  const q2 = await searchYT("Apur Sansar 1959 trailer Satyajit Ray");
  console.log("\nApur Sansar 1959:");
  for (const r of q2.slice(0, 5)) {
    console.log(`  [${r.id}] ${r.channel} : ${r.title}`);
  }
}
run();
