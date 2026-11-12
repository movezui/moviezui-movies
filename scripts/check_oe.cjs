// scripts/check_oe.cjs
async function check(id) {
  const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${id}&format=json`);
  if (!res.ok) console.log("oEmbed failed:", res.status);
  else console.log(await res.json());
}
check(process.argv[2]);
