// scripts/test_remaining_candidates.cjs
async function test() {
  const ids = [
    { name: "Chaar Sahibzaade (iRealities)", id: "-W1CMhxunf0" },
    { name: "Elizabeth Ekadashi (Zee)", id: "mmEwW40ovnY" },
    { name: "Belaseshe (BlockBuster)", id: "2ZYT9On-I-M" },
    { name: "Pather Panchali (Lumiere)", id: "sZNlRMdMdoI" },
    { name: "Apu Trilogy (Janus Films)", id: "mgv68E_o6VM" },
    { name: "Dostojee (Kathak Talkies)", id: "cdB99OBdCvQ" },
  ];
  for (const item of ids) {
    const res = await fetch(`https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${item.id}&format=json`);
    if (res.ok) {
      const data = await res.json();
      console.log(`[OK] ${item.name} (${item.id}): ${data.author_name} - ${data.title}`);
    } else {
      console.log(`[FAIL] ${item.name} (${item.id}): ${res.status}`);
    }
  }
}
test();
