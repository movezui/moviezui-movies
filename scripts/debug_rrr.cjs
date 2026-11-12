// scripts/debug_rrr.cjs
async function test() {
  const q = `"RRR" 2022 Hindi trailer`;
  const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`;
  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
    },
  });
  const text = await res.text();
  const match = text.match(/var ytInitialData = ({[\s\S]+?});<\/script>/);
  const data = JSON.parse(match[1]);
  const contents = data.contents?.twoColumnSearchResultsRenderer?.primaryContents?.sectionListRenderer?.contents?.[0]?.itemSectionRenderer?.contents || [];
  
  for (const c of contents) {
    if (c.videoRenderer) {
      const vr = c.videoRenderer;
      const title = vr.title?.runs?.map(r => r.text).join("");
      const channel = vr.ownerText?.runs?.map(r => r.text).join("");
      const len = vr.lengthText?.simpleText;
      console.log(`Title: "${title}" | Channel: "${channel}" | Len: "${len}"`);
      
      // Let's test evaluateCandidate logic:
      const normMovie = "rrr";
      const normCand = title.toLowerCase().replace(/[^a-z0-9]/g, " ").replace(/\s+/g, " ").trim();
      const movieWords = normMovie.split(" ").filter(w => w.length > 2 && w !== "the" && w !== "part" && w !== "chapter");
      console.log("normCand:", normCand);
      console.log("movieWords:", movieWords);
      const matchedWords = movieWords.filter(w => normCand.includes(w));
      console.log("matchedWords:", matchedWords);
    }
  }
}
test();
