// scripts/test_single_query.cjs
async function test() {
  const query = "Baahubali The Beginning 2015 Trailer";
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
    signal: AbortSignal.timeout(5000),
  });
  const html = await res.text();
  const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
  if (!match) return console.log("No data");
  const data = JSON.parse(match[1]);
  const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
  
  console.log(`Query "${query}" returned:`);
  for (const c of contents.slice(0, 10)) {
    if (c.videoRenderer) {
      console.log(`ID: ${c.videoRenderer.videoId} | Channel: "${c.videoRenderer.ownerText?.runs?.map(r=>r.text).join("")}" | Title: "${c.videoRenderer.title?.runs?.map(r=>r.text).join("")}"`);
    }
  }
}
test();
