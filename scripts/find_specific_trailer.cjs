// scripts/find_specific_trailer.cjs
async function search(q) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
  });
  const html = await res.text();
  const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
  if (!match) return [];
  const data = JSON.parse(match[1]);
  const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
  const results = [];
  for (const c of contents) {
    if (c.videoRenderer) {
      results.push({
        id: c.videoRenderer.videoId,
        title: c.videoRenderer.title?.runs?.map(r => r.text).join(""),
        channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join(""),
        length: c.videoRenderer.lengthText?.simpleText,
      });
    }
  }
  return results;
}

async function run() {
  const queries = [
    "Gangs of Wasseypur Part 1 Official Trailer Viacom18",
    "PK Official Trailer Aamir Khan UTV Motion Pictures",
    "Jab We Met Official Trailer Shemaroo",
    "Taare Zameen Par Official Trailer Aamir Khan Productions",
    "Lagaan Official Trailer Aamir Khan Productions",
    "3 Idiots Official Trailer Vidhu Vinod Chopra Films"
  ];
  for (const q of queries) {
    console.log(`\nResults for "${q}":`);
    const res = await search(q);
    res.slice(0, 3).forEach(r => console.log(`  ID: ${r.id} | Chan: "${r.channel}" | Title: "${r.title}" | Len: ${r.length}`));
    await new Promise(r => setTimeout(r, 600));
  }
}
run();
