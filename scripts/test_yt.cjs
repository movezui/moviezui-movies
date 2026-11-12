// scripts/test_yt.cjs
async function test() {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent("Kantara Hindi trailer Hombale Films")}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });
  console.log("Status:", res.status);
  const html = await res.text();
  console.log("HTML length:", html.length);
  const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
  console.log("Match found:", !!match);
  if (match) {
    try {
      const data = JSON.parse(match[1]);
      console.log("Parsed JSON successfully");
      const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
      console.log("Contents length:", contents.length);
      for (const c of contents.slice(0, 5)) {
        if (c.videoRenderer) {
          console.log("Video:", c.videoRenderer.videoId, c.videoRenderer.title?.runs?.[0]?.text);
        }
      }
    } catch (e) {
      console.error("JSON parse error:", e.message);
    }
  }
}
test();
