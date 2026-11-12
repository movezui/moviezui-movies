// scripts/refine_specific_remaining.cjs
const fs = require("fs");

async function searchYT(query) {
  try {
    const url = `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });
    if (!res.ok) return [];
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
          title: c.videoRenderer.title?.runs?.map(r => r.text).join("") || "",
          channel: c.videoRenderer.ownerText?.runs?.map(r => r.text).join("") || "",
        });
      }
    }
    return items;
  } catch (e) {
    return [];
  }
}

async function getOEmbed(id) {
  try {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
}

const list = [
  { name: "Chaar Sahibzaade (2014)", query: "Chaar Sahibzaade 2014 official theatrical trailer Harry Baweja" },
  { name: "Kaksparsh (2012)", query: "Kaksparsh official trailer Sachin Khedekar" },
  { name: "Elizabeth Ekadashi (2014)", query: "Elizabeth Ekadashi official trailer Zee Studios" },
  { name: "Charulata (1964)", query: "Charulata Criterion trailer Satyajit Ray" },
  { name: "Bhooter Bhabishyat (2012)", query: "Bhooter Bhabishyat trailer Bengali movie 2012" },
  { name: "Belaseshe (2015)", query: "Belaseshe official trailer Soumitra Windows" },
  { name: "Dostojee (2021)", query: "Dostojee official trailer Kathak Talkies Prasun Chatterjee" },
  { name: "Pather Panchali (1955)", query: "Pather Panchali Criterion Collection trailer" },
];

async function run() {
  for (const item of list) {
    console.log(`\nQuery: ${item.name} -> "${item.query}"`);
    const results = await searchYT(item.query);
    for (const r of results.slice(0, 4)) {
      const oe = await getOEmbed(r.id);
      console.log(`  [${r.id}] ${oe?.author_name || r.channel} | ${oe?.title || r.title}`);
    }
    await new Promise(r => setTimeout(r, 600));
  }
}

run();
