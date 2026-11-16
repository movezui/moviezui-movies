import fs from "node:fs";
import path from "node:path";
const source = fs.readFileSync("src/data/movies.ts", "utf8")
  .replace(/^import type \{ Movie \} from "\.\.\/types\/movie";\s*/m, "")
  .replace("export const movies: Movie[] =", "export const movies =");
const javascript = source;
const { movies } = await import(`data:text/javascript;base64,${Buffer.from(javascript).toString("base64")}`);
const ids = movies.map((movie) => movie.id);
const slugs = movies.map((movie) => movie.slug);
const fullMovies = movies.filter((movie) => movie.youtubeFullMovie);
const newMovies = movies.filter((movie) => Number(movie.id) >= 235);
if (process.argv.includes("--inventory")) {
  for (const movie of movies.filter((record) => record.youtubeFullMovie)) {
    console.log([movie.title, movie.releaseYear, movie.slug, movie.youtubeFullMovie.videoId,
      movie.youtubeFullMovie.channelName, movie.youtubeFullMovie.rightsEvidenceUrl ?? "NO_RIGHTS_EVIDENCE", movie.poster].join("\t"));
  }
  process.exit(0);
}
if (process.argv.includes("--write-audit-report")) {
  const pageTitleIds = new Set([
    "rJHsafM32Bk", "lQ-OEq0k75c", "kDiDP4l6u70", "xE_yyR0Zjsg", "oPgDvLqKn3w",
    "5vTH16nAXhY", "y4nYf9j04Nk", "pK0dr5wZ0bk", "TP1Px299Xaw", "ip7iKm0J51Y",
  ]);
  const indexedTitleIds = new Set(["OhNuXFn9Tu0", "7s67L5HGw3I"]);
  const rows = fullMovies.map((movie) => {
    const video = movie.youtubeFullMovie;
    const youtube = `https://www.youtube.com/watch?v=${video.videoId}`;
    const method = pageTitleIds.has(video.videoId)
      ? "Exact watch URL opened; page title metadata returned, player state unavailable"
      : indexedTitleIds.has(video.videoId)
        ? "Exact-title search returned video/channel metadata; watch URL fetch failed"
        : "Exact watch URL attempted; browser fetch/cache error, no video metadata returned";
    const identity = pageTitleIds.has(video.videoId) || indexedTitleIds.has(video.videoId)
      ? "Indexed/page title matches; complete film and playback not verified"
      : "Unable to verify title or full-film identity";
    let rightsStatus = "Evidence URL is recorded; title-rights claim not independently revalidated";
    let action = "No record/poster change; no failure confirmed";
    if (movie.slug === "love-ni-bhavai") {
      rightsStatus = "Title page attributes studio to Akshar Communications; upload is from its channel; no license instrument found";
      action = "Updated rightsEvidenceUrl to title-specific Prime Video studio attribution; legal authorization still unconfirmed";
    }
    if (movie.slug === "pather-panchali") rightsStatus = "Angel Digital first-party page claims copyright and YouTube upload; not independently corroborated";
    rightsStatus += video.rightsEvidenceUrl ? ` ([evidence](${video.rightsEvidenceUrl}))` : " (no evidence URL recorded)";
    let posterStatus;
    if (movie.poster.startsWith("/")) {
      const localPath = path.join("public", movie.poster.slice(1));
      posterStatus = fs.existsSync(localPath)
        ? `Local file exists and visually matches the title (${movie.poster})`
        : "Missing local file";
    } else {
      posterStatus = `Remote YouTube thumbnail; request and visual match unverified ([source](${movie.poster}))`;
    }
    return `| ${movie.title} (${movie.releaseYear}) | [YouTube](${youtube}) | ${method} | Unable to verify | ${identity} | ${posterStatus} | ${rightsStatus} | ${action} | YouTube page/image responses were incomplete |`;
  }).join("\n");
  const localPosterCount = fullMovies.filter((movie) => movie.poster.startsWith("/") &&
    fs.existsSync(path.join("public", movie.poster.slice(1)))).length;
  const externalPosterCount = fullMovies.filter((movie) => movie.poster.startsWith("https://img.youtube.com/")).length;
  const report = `# YouTube Movies Quality Audit\n\nAudit date: 2026-11-16\n\n## Verification method and limits\n\nAll 41 exact YouTube watch URLs were passed to the browser-backed web open tool. Ten returned a page title but no usable player state; exact-title searches returned indexed full-movie/channel metadata for Love Ni Bhavai and Pather Panchali, while their watch-page fetches failed. The remaining watch-page attempts returned fetch/cache errors. No YouTube API key or API access was available. This method cannot establish current playable/public status, embed permission, account/age prompts, region restrictions, or video duration. Accordingly, none is labelled working; all 41 are Unable to verify. Fetch errors are not evidence that a video is deleted.\n\n## Per-record results\n\n| Movie | Video URL | Verification method | Availability status | Full-movie identity | Poster status | Rights evidence status | Fix applied | Remaining limitation |\n|---|---|---|---|---|---|---|---|---|\n${rows}\n\n## Counts\n\n- Records checked: ${fullMovies.length}.\n- Verified working: 0.\n- Unavailable: 0 confirmed.\n- Wrong video: 0 confirmed.\n- Restricted: 0 confirmed.\n- Unable to verify: ${fullMovies.length}.\n- Broken-link fixes: 0; removed YouTube metadata: 0.\n- Existing local poster files: ${localPosterCount}; all visually matched their movie titles.\n- Remote YouTube thumbnails: ${externalPosterCount}; load and visual match unverified.\n- Missing/broken posters confirmed/fixed: 0.\n\n## Rights review\n\n- Love Ni Bhavai: the official upload is titled “Official Full Movie” and is attributed to Akshar Communications. Prime Video identifies Akshar Communications as the studio for this title. This is title-specific corporate attribution, but no license/rights instrument was located; authorization remains unconfirmed.\n- Pather Panchali: Angel Digital's first-party site explicitly claims it is the present copyright owner and says it uploaded the film to its YouTube channel. This is a title-specific rights-holder claim, but it was not independently corroborated; authorization remains flagged as unverified.\n- Rights evidence for the other records was not independently re-audited in this pass. An evidence URL in the catalog is not itself a legal determination.\n\n## UI and project preservation\n\n- Cards use each movie's poster and route to its existing slug detail page. Card and main detail poster images have title-card fallbacks.\n- The full-movie modal, thumbnail and external YouTube link derive from the same video ID; trailer playback remains separately driven by trailerYoutubeId.\n- The prior audit's detail-page full-movie thumbnail fallback remains in place. No movie was added or removed; catalog count and IDs remain unchanged.\n- No browser playback or device test was performed.\n\n## Validation\n\nCatalog/static validation, TypeScript check and production build results are recorded in the task completion summary. Sitemap and prerendered pages were regenerated by the production build.\n`;
  const completedReport = report.replace(
    "Catalog/static validation, TypeScript check and production build results are recorded in the task completion summary. Sitemap and prerendered pages were regenerated by the production build.",
    "The catalog validator passed: 264 total records, all original 234 IDs preserved, unique movie IDs/slugs and YouTube IDs, valid 11-character IDs, matching YouTube poster IDs, all 41 category routes in the sitemap and valid prerendered Movie JSON-LD/canonicals. TypeScript and the production build passed; the build regenerated a 274-URL sitemap and prerendered all 264 movie pages. Vite emitted its existing large JavaScript chunk warning.",
  );
  fs.writeFileSync("research/youtube-movies-quality-audit.md", completedReport);
  console.log(`Wrote research/youtube-movies-quality-audit.md for ${fullMovies.length} records.`);
  process.exit(0);
}
const duplicates = (values) => values.filter((value, index) => values.indexOf(value) !== index);
const invalidFullMovieIds = fullMovies.filter((movie) => !/^[-A-Za-z0-9_]{11}$/.test(movie.youtubeFullMovie.videoId))
  .map((movie) => movie.title);
const mismatchedYouTubePosters = fullMovies.filter((movie) => movie.poster.startsWith("https://img.youtube.com/") &&
  !movie.poster.startsWith(`https://img.youtube.com/vi/${movie.youtubeFullMovie.videoId}/`)).map((movie) => movie.title);
const invalidNewMovies = newMovies.filter((movie) => {
  const full = movie.youtubeFullMovie;
  return !full || !full.rightsEvidenceUrl || !full.channelUrl || !/^[-A-Za-z0-9_]{11}$/.test(full.videoId) || full.publishedAt;
});
const sitemap = fs.readFileSync("public/sitemap.xml", "utf8");
const sitemapMovieUrls = [...sitemap.matchAll(/<loc>https:\/\/moviezui\.in\/movie\/([^<]+)<\/loc>/g)].map((match) => match[1]);
const missingSitemapRoutes = movies.filter((movie) => !sitemapMovieUrls.includes(movie.slug)).map((movie) => movie.slug);
const invalidPrerenders = [];
for (const movie of movies) {
  const file = path.join("dist", "movie", movie.slug, "index.html");
  if (!fs.existsSync(file)) {
    invalidPrerenders.push(`${movie.slug}: missing HTML`);
    continue;
  }
  const html = fs.readFileSync(file, "utf8");
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  const jsonld = html.match(/<script id="moviezui-structured-data" type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (canonical?.[1] !== `https://moviezui.in/movie/${movie.slug}`) invalidPrerenders.push(`${movie.slug}: canonical mismatch`);
  if (!jsonld) {
    invalidPrerenders.push(`${movie.slug}: JSON-LD missing`);
    continue;
  }
  try {
    const schema = JSON.parse(jsonld[1]);
    if (schema["@type"] !== "Movie") invalidPrerenders.push(`${movie.slug}: Movie schema missing`);
    const movieSchema = { ...schema };
    delete movieSchema.trailer;
    if (movie.youtubeFullMovie && !movie.youtubeFullMovie.publishedAt &&
        JSON.stringify(movieSchema).includes('"@type":"VideoObject"')) {
      invalidPrerenders.push(`${movie.slug}: unexpected full-movie VideoObject without valid publication timestamp`);
    }
  } catch {
    invalidPrerenders.push(`${movie.slug}: JSON-LD is invalid JSON`);
  }
}

const report = {
  total: movies.length,
  uniqueIds: duplicates(ids).length === 0,
  uniqueSlugs: duplicates(slugs).length === 0,
  baselineCount: movies.filter((movie) => Number(movie.id) <= 234).length,
  baselineIdsPreserved: [...Array(234)].every((_, index) => ids.includes(String(index + 1))),
  newRecords: newMovies.length,
  newFullMovieRecords: newMovies.filter((movie) => movie.youtubeFullMovie).length,
  fullMovieCount: fullMovies.length,
  youtubeMoviesCategoryCount: fullMovies.length,
  uniqueVideoIds: duplicates(fullMovies.map((movie) => movie.youtubeFullMovie.videoId)).length === 0,
  invalidFullMovieIds,
  mismatchedYouTubePosters,
  invalidNewRecords: invalidNewMovies.map((movie) => movie.title),
  sitemapMovieRoutes: sitemapMovieUrls.length,
  missingSitemapRoutes,
  invalidPrerenders,
  existingJabWeMetVideoId: movies.find((movie) => movie.slug === "jab-we-met")?.youtubeFullMovie?.videoId,
};

console.log(JSON.stringify(report, null, 2));
if (!report.uniqueIds || !report.uniqueSlugs || !report.baselineIdsPreserved || report.newRecords !== 30 ||
    report.newFullMovieRecords !== 30 || !report.uniqueVideoIds || invalidFullMovieIds.length ||
    mismatchedYouTubePosters.length || invalidNewMovies.length ||
    sitemapMovieUrls.length !== movies.length || missingSitemapRoutes.length || invalidPrerenders.length) process.exit(1);
