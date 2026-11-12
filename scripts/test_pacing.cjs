// scripts/test_pacing.cjs
async function searchYT(q) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
      },
    });
    if (!res.ok) return { error: `status ${res.status}` };
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
    if (!match) return { error: "no_data" };
    const data = JSON.parse(match[1]);
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    const items = [];
    for (const c of contents) {
      if (c.videoRenderer) {
        items.push({
          id: c.videoRenderer.videoId,
          title: c.videoRenderer.title?.runs?.map(r => r.text).join(""),
          channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join(""),
        });
      }
    }
    return { items: items.slice(0, 3) };
  } catch (e) {
    return { error: e.message };
  }
}

async function run() {
  const testQueries = [
    "Avengers Endgame Official Hindi Trailer Marvel India",
    "Inception 2010 Official Trailer Warner Bros",
    "Sholay 1975 Official Trailer Sippy Films",
    "Baahubali The Beginning Official Hindi Trailer Dharma Productions",
    "Kantara Official Hindi Trailer Hombale Films"
  ];
  for (const q of testQueries) {
    console.log(`Searching: ${q}...`);
    const res = await searchYT(q);
    console.log("Result:", res.items ? res.items[0] : res.error);
    await new Promise(r => setTimeout(r, 1000));
  }
}

run();
