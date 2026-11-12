// scripts/test_jw.cjs
async function test(name) {
  const query = `query GetSuggestedTitles($country: Country!, $filter: TitleFilter) {
    popularTitles(country: $country, filter: $filter, first: 3) {
      edges {
        node {
          content(country: $country, language: "en") {
            title
            originalReleaseYear
          }
          offers(country: $country, platform: WEB) {
            monetizationType
            package {
              clearName
              shortName
            }
            standardWebURL
          }
        }
      }
    }
  }`;
  const res = await fetch('https://apis.justwatch.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({ query, variables: { country: 'IN', filter: { searchQuery: name } } })
  });
  const json = await res.json();
  const node = json.data?.popularTitles?.edges?.[0]?.node;
  if (!node) { console.log(name, 'NOT FOUND'); return; }
  console.log('=== ' + name + ' ===');
  console.log('Title:', node.content.title, '(' + node.content.originalReleaseYear + ')');
  const offers = (node.offers || []).map(o => ({
    platform: o.package.clearName,
    type: o.monetizationType,
    url: o.standardWebURL
  }));
  console.log('Offers count:', offers.length);
  // deduplicate by platform + type
  const seen = new Set();
  offers.forEach(o => {
    const key = o.platform + '|' + o.type;
    if (!seen.has(key)) {
      seen.add(key);
      console.log(' - ' + o.platform + ' [' + o.type + ']: ' + o.url);
    }
  });
}

async function run() {
  await test('Hellaro');
  await test('Aavesham');
  await test('Pushpa: The Rise');
  await test('Manjummel Boys');
}
run();
