// scripts/debug_query.cjs
async function test() {
  const q = `"RRR" 2022 Hindi trailer`;
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
  });
  console.log("Status:", res.status);
  const text = await res.text();
  console.log("HTML length:", text.length);
  const match = text.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
  console.log("ytInitialData matched:", !!match);
}
test();
