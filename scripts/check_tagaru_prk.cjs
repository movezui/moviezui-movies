// scripts/check_tagaru_prk.cjs
async function check() {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent("PRK Audio Tagaru teaser Shiva Rajkumar")}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });
  const html = await res.text();
  const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
  if (!match) return;
  const data = JSON.parse(match[1]);
  const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
  for (const c of contents.slice(0, 5)) {
    if (c.videoRenderer) {
      console.log(c.videoRenderer.videoId, c.videoRenderer.ownerText?.runs?.[0]?.text, c.videoRenderer.title?.runs?.[0]?.text);
    }
  }
}
check();
