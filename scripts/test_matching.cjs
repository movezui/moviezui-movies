// scripts/test_matching.cjs
const query = `query GetSuggestedTitles($country: Country!, $filter: TitleFilter) {
  popularTitles(country: $country, filter: $filter, first: 5) {
    edges {
      node {
        id
        objectId
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

async function searchJW(title, year) {
  const res = await fetch('https://apis.justwatch.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({ query, variables: { country: 'IN', filter: { searchQuery: title } } })
  });
  const json = await res.json();
  const edges = json.data?.popularTitles?.edges || [];
  
  // Find matching node by title and year (+/- 1)
  const match = edges.find(e => {
    const node = e.node;
    const y = node.content.originalReleaseYear;
    const yearDiff = Math.abs(y - year);
    return yearDiff <= 1;
  });

  if (!match) {
    console.log(`NO MATCH FOR: ${title} (${year})`);
    return null;
  }

  const node = match.node;
  console.log(`MATCHED: ${title} (${year}) -> ${node.content.title} (${node.content.originalReleaseYear})`);
  return node.offers;
}

async function run() {
  await searchJW('Drishyam', 2013); // Malayalam
  await searchJW('Drishyam', 2015); // Hindi
  await searchJW('Vikram', 2022); // Tamil
}
run();
