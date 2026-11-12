// scripts/fix_gujarati_outliers.cjs
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
  const items = [];
  for (const c of contents) {
    if (c.videoRenderer) {
      items.push({
        id: c.videoRenderer.videoId,
        title: c.videoRenderer.title?.runs?.map(r => r.text).join(""),
        channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join(""),
        length: c.videoRenderer.lengthText?.simpleText,
      });
    }
  }
  return items;
}

async function run() {
  console.log("Searching Dhh Gujarati Movie Official Trailer Naseeruddin Shah...");
  const dhh = await search("Dhh Gujarati Movie Official Trailer Naseeruddin Shah");
  dhh.slice(0, 3).forEach(r => console.log(" ", r.id, "|", r.channel, "|", r.title));

  console.log("\nSearching Oxygen Gujarati Movie Trailer Aanshul Trivedi...");
  const oxy = await search("Oxygen Gujarati Movie Official Trailer Aanshul Trivedi");
  oxy.slice(0, 3).forEach(r => console.log(" ", r.id, "|", r.channel, "|", r.title));
}
run();
