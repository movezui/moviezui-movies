// scripts/test_fail.cjs
async function test() {
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent("Premalu official trailer Bhavana Studios")}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    },
  });
  const html = await res.text();
  console.log("Status:", res.status);
  console.log("Includes ytInitialData:", html.includes("ytInitialData"));
  if (!html.includes("ytInitialData")) {
    console.log("Snippet:", html.slice(0, 500));
  } else {
    const match = html.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
    console.log("Regex matched:", !!match);
    if (match) {
      const data = JSON.parse(match[1]);
      const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
      console.log("Results count:", contents.length);
    }
  }
}
test();
