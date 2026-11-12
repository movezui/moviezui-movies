// scripts/test_yt_search.cjs
async function searchYouTube(query) {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
  });
  const html = await res.text();
  
  // Extract ytInitialData
  const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/) ||
                html.match(/window\["ytInitialData"\] = ({[\s\S]+?});<\/script>/);
  if (!match) {
    console.log("Could not find ytInitialData in HTML");
    return [];
  }
  
  const data = JSON.parse(match[1]);
  const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
  
  const results = [];
  for (const item of contents) {
    const vr = item.videoRenderer;
    if (!vr) continue;
    const videoId = vr.videoId;
    const title = vr.title?.runs?.map(r => r.text).join("") || "";
    const channel = vr.ownerText?.runs?.map(r => r.text).join("") || "";
    const length = vr.lengthText?.simpleText || "";
    results.push({ videoId, title, channel, length });
  }
  return results;
}

async function run() {
  console.log("Searching Dangal Official Trailer...");
  const dangal = await searchYouTube("Dangal Official Trailer Aamir Khan");
  console.log("Dangal results:", dangal.slice(0, 3));

  console.log("\nSearching RRR Hindi Trailer...");
  const rrr = await searchYouTube("RRR Official Hindi Trailer Pen Movies");
  console.log("RRR results:", rrr.slice(0, 3));
}

run();
