// scripts/search_tagaru_official.cjs
async function check() {
  const channels = ["PRK Audio", "Anand Audio", "Lahari Music", "D Beats", "A2 Music"];
  for (const c of channels) {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(c + " Tagaru trailer")}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      },
    });
    const html = await res.text();
    const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
    if (!match) continue;
    const data = JSON.parse(match[1]);
    const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
    for (const item of contents.slice(0, 5)) {
      if (item.videoRenderer) {
        console.log(c, "->", item.videoRenderer.videoId, "|", item.videoRenderer.ownerText?.runs?.[0]?.text, "|", item.videoRenderer.title?.runs?.[0]?.text);
      }
    }
  }
}
check();
