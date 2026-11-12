// scripts/generate_sitemap.cjs
const fs = require("fs");
const path = require("path");

// Production canonical domain
const SITE_URL = process.env.VITE_SITE_URL || "https://moviezui.netlify.app";
const TODAY = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

// Load movie data from movies.ts using regex to extract slugs
const moviesFilePath = path.join(__dirname, "../src/data/movies.ts");
const moviesFileContent = fs.readFileSync(moviesFilePath, "utf-8");

// Extract slugs from the movies.ts array (handles both "slug": "value" and slug: "value")
const slugMatches = [];
const slugRegex = /"?slug"?\s*:\s*"([^"]+)"/g;
let match;
while ((match = slugRegex.exec(moviesFileContent)) !== null) {
  slugMatches.push(match[1]);
}

// Remove duplicates if any
const uniqueSlugs = Array.from(new Set(slugMatches));

console.log(`Extracted ${uniqueSlugs.length} unique movie slugs from src/data/movies.ts`);

// Core static pages
const corePages = [
  { path: "", changefreq: "daily", priority: "1.0" },
  { path: "movies", changefreq: "daily", priority: "0.9" },
  { path: "genres", changefreq: "weekly", priority: "0.8" },
  { path: "about", changefreq: "monthly", priority: "0.7" },
  { path: "contact", changefreq: "monthly", priority: "0.7" },
  { path: "privacy-policy", changefreq: "monthly", priority: "0.5" },
  { path: "terms", changefreq: "monthly", priority: "0.5" },
  { path: "disclaimer", changefreq: "monthly", priority: "0.5" },
  { path: "cookie-policy", changefreq: "monthly", priority: "0.5" },
  { path: "copyright-policy", changefreq: "monthly", priority: "0.5" },
];

let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

// 1. Add core pages
for (const page of corePages) {
  const loc = page.path ? `${SITE_URL}/${page.path}` : `${SITE_URL}/`;
  xml += `  <url>\n`;
  xml += `    <loc>${loc}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
  xml += `    <priority>${page.priority}</priority>\n`;
  xml += `  </url>\n`;
}

// 2. Add individual movie routes
for (const slug of uniqueSlugs) {
  xml += `  <url>\n`;
  xml += `    <loc>${SITE_URL}/movie/${slug}</loc>\n`;
  xml += `    <lastmod>${TODAY}</lastmod>\n`;
  xml += `    <changefreq>weekly</changefreq>\n`;
  xml += `    <priority>0.8</priority>\n`;
  xml += `  </url>\n`;
}

xml += `</urlset>\n`;

// Write to public/sitemap.xml
const publicDir = path.join(__dirname, "../public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

const sitemapPath = path.join(publicDir, "sitemap.xml");
fs.writeFileSync(sitemapPath, xml, "utf-8");
console.log(`Successfully generated public/sitemap.xml with ${corePages.length + uniqueSlugs.length} URLs!`);

// Generate robots.txt
const robotsTxtContent = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /
Disallow: /movies?*

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
`;

const robotsPath = path.join(publicDir, "robots.txt");
fs.writeFileSync(robotsPath, robotsTxtContent, "utf-8");
console.log(`Successfully generated public/robots.txt with canonical sitemap URL: ${SITE_URL}/sitemap.xml`);
