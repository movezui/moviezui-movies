// scripts/verify_footer_and_seo.cjs
const fs = require("fs");
const path = require("path");

console.log("==================================================");
console.log("  MOVIEZUI - FOOTER & SITEMAP VERIFICATION SUITE  ");
console.log("==================================================");

let failed = 0;
function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
  } else {
    console.error(`[FAIL] ${message}`);
    failed++;
  }
}

// 1. Verify App.tsx routes
const appTsx = fs.readFileSync("src/App.tsx", "utf-8");
const expectedRoutes = [
  "/",
  "/movies",
  "/movie/:slug",
  "/genres",
  "/about",
  "/contact",
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/copyright-policy",
  "/cookie-policy",
];

console.log("\n1. Verifying App.tsx registered routes:");
for (const r of expectedRoutes) {
  assert(appTsx.includes(`path="${r}"`), `Route ${r} registered in App.tsx`);
}

// 2. Verify Footer.tsx links and order
const footerTsx = fs.readFileSync("src/components/layout/Footer.tsx", "utf-8");
console.log("\n2. Verifying Footer.tsx links and structure:");

// Check Quick Links order: Home -> All Movies -> Browse by Genres -> About Moviezui -> Contact Us
const quickLinksPattern = /Quick Links[\s\S]*?to="\/"[\s\S]*?to="\/movies"[\s\S]*?to="\/genres"[\s\S]*?to="\/about"[\s\S]*?to="\/contact"/;
assert(quickLinksPattern.test(footerTsx), "Quick Links arranged in exact requested order (Home, Movies, Genres, About, Contact)");

// Check Contact immediately below About
const contactBelowAbout = /About Moviezui[\s\S]*?to="\/contact"[\s\S]*?Contact Us/;
assert(contactBelowAbout.test(footerTsx), "Contact Us appears immediately below About Moviezui");

// Check dedicated Legal section
assert(footerTsx.includes("Legal</h3>") || footerTsx.includes("Legal\n"), "Dedicated Legal header exists in Footer");
const legalLinks = [
  "/privacy-policy",
  "/terms",
  "/disclaimer",
  "/cookie-policy",
  "/copyright-policy",
  "/sitemap.xml",
];

for (const link of legalLinks) {
  assert(footerTsx.includes(`"${link}"`), `Legal section contains link to ${link}`);
}

// 3. Verify public/sitemap.xml
console.log("\n3. Verifying public/sitemap.xml:");
assert(fs.existsSync("public/sitemap.xml"), "public/sitemap.xml exists");
const sitemapContent = fs.readFileSync("public/sitemap.xml", "utf-8");
assert(sitemapContent.startsWith('<?xml version="1.0" encoding="UTF-8"?>'), "Valid XML declaration");
assert(sitemapContent.includes('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'), "Valid sitemap schema");
assert(!sitemapContent.includes("localhost"), "Zero localhost URLs in sitemap");
// Count URLs in sitemap
const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g) || [];
console.log(`Total URLs in sitemap: ${urlMatches.length}`);
assert(urlMatches.length >= 238, `Sitemap contains all core pages and movies (${urlMatches.length} URLs >= 238)`);
assert(!urlMatches.some((u) => u.includes("?")), "Zero query parameter URLs in sitemap loc tags");

// 4. Verify public/robots.txt
console.log("\n4. Verifying public/robots.txt:");
assert(fs.existsSync("public/robots.txt"), "public/robots.txt exists");
const robotsContent = fs.readFileSync("public/robots.txt", "utf-8");
assert(robotsContent.includes("User-agent: *"), "robots.txt has User-agent: *");
assert(robotsContent.includes("Sitemap: https://moviezui.netlify.app/sitemap.xml"), "robots.txt references canonical sitemap");

// 5. Verify Movie Details URLs in sitemap
console.log("\n5. Verifying Movie Slugs in sitemap:");
const moviesContent = fs.readFileSync("src/data/movies.ts", "utf-8");
const slugMatches = [];
const slugRegex = /"?slug"?\s*:\s*"([^"]+)"/g;
let m;
while ((m = slugRegex.exec(moviesContent)) !== null) {
  slugMatches.push(m[1]);
}
const uniqueSlugs = Array.from(new Set(slugMatches));
assert(uniqueSlugs.length === 228, `All 228 movies accounted for (found ${uniqueSlugs.length})`);

let missingSlugs = 0;
for (const slug of uniqueSlugs) {
  if (!sitemapContent.includes(`https://moviezui.netlify.app/movie/${slug}`)) {
    missingSlugs++;
  }
}
assert(missingSlugs === 0, `All ${uniqueSlugs.length} individual movie URLs present in sitemap.xml`);

// 6. Verify dist prerendering and build output
console.log("\n6. Verifying Production dist/ output:");
assert(fs.existsSync("dist/sitemap.xml"), "dist/sitemap.xml exists");
assert(fs.existsSync("dist/robots.txt"), "dist/robots.txt exists");
assert(fs.existsSync("dist/about/index.html"), "dist/about/index.html prerendered");
assert(fs.existsSync("dist/contact/index.html"), "dist/contact/index.html prerendered");
assert(fs.existsSync("dist/privacy-policy/index.html"), "dist/privacy-policy/index.html prerendered");
assert(fs.existsSync("dist/terms/index.html"), "dist/terms/index.html prerendered");
assert(fs.existsSync("dist/disclaimer/index.html"), "dist/disclaimer/index.html prerendered");
assert(fs.existsSync("dist/cookie-policy/index.html"), "dist/cookie-policy/index.html prerendered");
assert(fs.existsSync("dist/copyright-policy/index.html"), "dist/copyright-policy/index.html prerendered");

// Check sample movie prerenders
const sampleMovies = ["hellaro", "dangal", "interstellar", "reva", "rrr"];
for (const s of sampleMovies) {
  const p = `dist/movie/${s}/index.html`;
  assert(fs.existsSync(p), `Prerendered HTML exists for ${p}`);
  if (fs.existsSync(p)) {
    const html = fs.readFileSync(p, "utf-8");
    assert(html.includes("<title>") && html.includes("Moviezui"), `Proper <title> in ${s}`);
    assert(html.includes('id="moviezui-structured-data"'), `Schema.org JSON-LD in ${s}`);
    assert(html.includes("<h1"), `Semantic <h1> in ${s}`);
    assert(html.includes("Where to Watch"), `Where to Watch section in ${s}`);
  }
}

console.log("\n==================================================");
if (failed === 0) {
  console.log("  ALL TESTS PASSED SUCCESSFULLY! (0 failures)     ");
} else {
  console.error(`  TEST SUITE COMPLETED WITH ${failed} FAILURES!   `);
}
console.log("==================================================");
process.exit(failed === 0 ? 0 : 1);
