// scripts/fix_chhello_show.cjs
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
      });
    }
  }
  return items;
}

async function run() {
  const r = await search("Chhello Show Last Film Show Official Trailer Roy Kapur Films");
  r.slice(0, 3).forEach(x => console.log(x.id, "|", x.channel, "|", x.title));
}
run();
