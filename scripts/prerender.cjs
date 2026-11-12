// scripts/prerender.cjs
const fs = require("fs");
const path = require("path");

const SITE_URL = process.env.VITE_SITE_URL || "https://moviezui.netlify.app";
const DIST_DIR = path.join(__dirname, "../dist");
const TEMPLATE_PATH = path.join(DIST_DIR, "index.html");

if (!fs.existsSync(TEMPLATE_PATH)) {
  console.error("Error: dist/index.html not found. Run vite build first.");
  process.exit(1);
}

const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");

// Load movies data
const moviesFilePath = path.join(__dirname, "../src/data/movies.ts");
const moviesContent = fs.readFileSync(moviesFilePath, "utf-8");

// Safe extraction of movies
const movieBlocks = moviesContent.split(/\{\s*"id":/g).slice(1);
const movies = [];

for (const block of movieBlocks) {
  const getField = (key) => {
    const match = new RegExp(`"${key}":\\s*("(?:\\\\.|[^"\\\\])*"|\\d+|true|false|\\[[\\s\\S]*?\\])`).exec(block);
    if (!match) return null;
    try {
      return JSON.parse(match[1]);
    } catch {
      return match[1].replace(/^"|"$/g, "");
    }
  };

  const id = getField("id");
  const slug = getField("slug");
  const title = getField("title");
  const releaseYear = getField("releaseYear");
  const language = getField("language");
  const industry = getField("industry");
  const director = getField("director");
  const description = getField("description");
  const poster = getField("poster");
  const runtime = getField("runtime");
  const imdbRating = getField("imdbRating");
  const genres = getField("genres") || [];
  const cast = getField("cast") || [];

  // Extract watchOptions
  const watchOptionsMatch = /"watchOptions":\s*(\[[^\]]*?\])/s.exec(block);
  let watchOptions = [];
  if (watchOptionsMatch) {
    try {
      watchOptions = JSON.parse(watchOptionsMatch[1]);
    } catch {
      watchOptions = [];
    }
  }

  if (slug && title) {
    movies.push({
      id,
      slug,
      title,
      releaseYear,
      language,
      industry,
      director,
      description,
      poster,
      runtime,
      imdbRating,
      genres,
      cast,
      watchOptions,
    });
  }
}

console.log(`Prerenderer loaded ${movies.length} movies for static HTML generation.`);

function injectMetadata(html, { title, description, canonicalUrl, ogImage, ogType = "website", schema, crawlableContent }) {
  let result = html;

  // Replace Title
  result = result.replace(/<title>.*?<\/title>/i, `<title>${title}</title>`);

  // Meta Description
  if (result.includes('<meta name="description"')) {
    result = result.replace(/<meta\s+name="description"\s+content=".*?"\s*\/?>/i, `<meta name="description" content="${description}" />`);
  } else {
    result = result.replace("</head>", `  <meta name="description" content="${description}" />\n</head>`);
  }

  // Canonical
  result = result.replace("</head>", `  <link rel="canonical" href="${canonicalUrl}" />\n</head>`);

  // Open Graph
  const ogTags = `
  <meta property="og:site_name" content="Moviezui" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${canonicalUrl}" />
  <meta property="og:type" content="${ogType}" />
  <meta property="og:image" content="${ogImage || `${SITE_URL}/logo.jpg`}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${ogImage || `${SITE_URL}/logo.jpg`}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />`;
  result = result.replace("</head>", `${ogTags}\n</head>`);

  // Schema.org JSON-LD
  if (schema) {
    const jsonLd = `\n  <script id="moviezui-structured-data" type="application/ld+json">${JSON.stringify(schema)}</script>`;
    result = result.replace("</head>", `${jsonLd}\n</head>`);
  }

  // Crawlable Server-Rendered HTML inside <div id="root">
  if (crawlableContent) {
    result = result.replace('<div id="root"></div>', `<div id="root">${crawlableContent}</div>`);
  }

  return result;
}

// 1. Prerender Core Static Pages
const staticPages = [
  {
    route: "about",
    title: "About Us – Global Movie Discovery Platform | Moviezui",
    description: "Learn about Moviezui, our mission to make world cinema discoverable across languages and industries, our verified Where to Watch feature, and our commitment to accurate movie information.",
    h1: "About Moviezui – Discover Cinema Without Borders",
    intro: "Moviezui is a movie discovery platform designed to help movie lovers explore cinema from around the world.",
  },
  {
    route: "contact",
    title: "Contact Us – Inquiries & Movie Information Corrections | Moviezui",
    description: "Get in touch with Moviezui. Send movie corrections, streaming availability updates, copyright inquiries, or partnership proposals.",
    h1: "Contact Moviezui",
    intro: "Have questions, suggestions, movie data corrections, or streaming link updates? Reach out to our team.",
  },
  {
    route: "privacy-policy",
    title: "Privacy Policy | Moviezui",
    description: "Official Moviezui Privacy Policy detailing our privacy-first design, handling of contact inquiries, and commitment to user protection.",
    h1: "Privacy Policy",
    intro: "Learn how Moviezui protects your personal privacy and manages voluntarily submitted communications.",
  },
  {
    route: "terms",
    title: "Terms and Conditions | Moviezui",
    description: "Review the Moviezui Terms and Conditions governing your access and use of our movie discovery platform and external streaming link disclaimers.",
    h1: "Terms and Conditions",
    intro: "Review the terms and conditions governing the access and informational use of Moviezui.",
  },
  {
    route: "disclaimer",
    title: "Disclaimer – Informational & Streaming Availability Notice | Moviezui",
    description: "Important informational disclaimers regarding Moviezui movie data, third-party streaming links, licensing windows, and external platform redirection.",
    h1: "Disclaimer",
    intro: "Moviezui is an informational movie discovery directory. We do not host, store, or stream media files.",
  },
  {
    route: "cookie-policy",
    title: "Cookie Policy | Moviezui",
    description: "Learn about technical browser cookies and local storage used by Moviezui. Zero profiling and zero advertising trackers.",
    h1: "Cookie Policy",
    intro: "Transparent explanation of essential browser cookies and technical storage used on Moviezui.",
  },
  {
    route: "copyright-policy",
    title: "Copyright & DMCA Policy | Moviezui",
    description: "Moviezui Intellectual Property and Copyright Policy. Procedure for submitting copyright infringement notices, content corrections, and DMCA removal requests.",
    h1: "Copyright & DMCA Policy",
    intro: "Procedures and guidelines for copyright holders, content attribution, and DMCA takedown requests.",
  },
  {
    route: "movies",
    title: "All Movies – Browse Complete World Cinema Catalog | Moviezui",
    description: "Search, filter, and discover movies across Bollywood, Hollywood, Gujarati, South Indian, and regional cinema. Find verified Where to Watch streaming options.",
    h1: "All Movies – Complete World Cinema Catalog",
    intro: "Browse and discover movies across Hindi, English, Gujarati, Tamil, Telugu, Malayalam, and international industries.",
  },
  {
    route: "genres",
    title: "Browse Movies by Genre – Drama, Action, Comedy & More | Moviezui",
    description: "Explore 17+ film genres on Moviezui. Find movies in Drama, Comedy, Action, Thriller, Sci-Fi, Romance, Crime, and regional storytelling traditions.",
    h1: "Explore Cinema by Genre",
    intro: "Discover compelling stories across Drama, Comedy, Action, Thriller, Sci-Fi, Horror, Romance, and regional folklore.",
  },
];

for (const page of staticPages) {
  const dir = path.join(DIST_DIR, page.route);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const canonicalUrl = `${SITE_URL}/${page.route}`;
  const crawlableContent = `
    <header style="padding: 20px; border-bottom: 1px solid #222; text-align: center;">
      <a href="${SITE_URL}" style="color: #FFD21F; font-size: 24px; font-weight: bold; text-decoration: none;">MOVIEZUI</a>
      <p style="color: #A5A7B0; font-size: 13px;">Global Movie Discovery Platform</p>
    </header>
    <main style="max-width: 900px; margin: 40px auto; padding: 0 20px; color: #fff; font-family: sans-serif;">
      <h1 style="font-size: 32px; font-weight: 800; margin-bottom: 12px; color: #fff;">${page.h1}</h1>
      <p style="color: #A5A7B0; font-size: 16px; line-height: 1.6;">${page.intro}</p>
      <nav style="margin-top: 30px;">
        <a href="${SITE_URL}" style="color: #FFD21F; margin-right: 15px;">Home</a>
        <a href="${SITE_URL}/movies" style="color: #FFD21F; margin-right: 15px;">All Movies</a>
        <a href="${SITE_URL}/genres" style="color: #FFD21F; margin-right: 15px;">Genres</a>
        <a href="${SITE_URL}/about" style="color: #FFD21F;">About Us</a>
      </nav>
    </main>
  `;

  const html = injectMetadata(template, {
    title: page.title,
    description: page.description,
    canonicalUrl,
    crawlableContent,
  });

  fs.writeFileSync(path.join(dir, "index.html"), html, "utf-8");
}

console.log(`Generated prerendered HTML for ${staticPages.length} core static routes.`);

// 2. Prerender all 228 Movie Details Routes
for (const movie of movies) {
  const movieDir = path.join(DIST_DIR, "movie", movie.slug);
  if (!fs.existsSync(movieDir)) fs.mkdirSync(movieDir, { recursive: true });

  const title = `${movie.title} (${movie.releaseYear}) – Cast, Story, Details & Where to Watch | Moviezui`;
  const description = `Explore ${movie.title} (${movie.releaseYear}), directed by ${movie.director}, starring ${movie.cast.slice(0, 3).join(", ")}. Discover story summary, genre, and verified streaming platforms on Moviezui.`;
  const canonicalUrl = `${SITE_URL}/movie/${movie.slug}`;
  const posterUrl = movie.poster.startsWith("http") ? movie.poster : `${SITE_URL}${movie.poster.startsWith("/") ? movie.poster : `/${movie.poster}`}`;

  // Movie Schema.org
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Movie",
    name: movie.title,
    description: movie.description,
    image: posterUrl,
    url: canonicalUrl,
    datePublished: `${movie.releaseYear}`,
    inLanguage: movie.language,
    genre: movie.genres,
    director: {
      "@type": "Person",
      name: movie.director,
    },
    actor: movie.cast.map((actorName) => ({
      "@type": "Person",
      name: actorName,
    })),
  };

  if (movie.runtime) {
    movieSchema.duration = `PT${movie.runtime}M`;
  }

  if (typeof movie.imdbRating === "number" && movie.imdbRating > 0) {
    movieSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: movie.imdbRating.toFixed(1),
      bestRating: "10",
      worstRating: "1",
      ratingCount: 100,
    };
  }

  // Build semantic, crawlable HTML representation
  const watchOptionsList = movie.watchOptions && movie.watchOptions.length > 0
    ? movie.watchOptions.map(opt => `<li style="margin-bottom: 6px;"><a href="${opt.url}" rel="noopener noreferrer" target="_blank" style="color: #FFD21F; font-weight: 600;">${opt.platform}</a> - <span style="color: #4ade80; text-transform: uppercase; font-size: 11px;">${opt.type}</span></li>`).join("")
    : `<li>No verified streaming options available right now.</li>`;

  const crawlableContent = `
    <header style="padding: 20px; border-bottom: 1px solid #222; text-align: center;">
      <a href="${SITE_URL}" style="color: #FFD21F; font-size: 24px; font-weight: bold; text-decoration: none;">MOVIEZUI</a>
      <p style="color: #A5A7B0; font-size: 13px;">Global Movie Discovery Platform</p>
      <nav style="margin-top: 10px; font-size: 13px;">
        <a href="${SITE_URL}" style="color: #A5A7B0; margin-right: 12px;">Home</a> /
        <a href="${SITE_URL}/movies" style="color: #A5A7B0; margin: 0 12px;">Movies</a> /
        <span style="color: #fff;">${movie.title}</span>
      </nav>
    </header>
    <main style="max-width: 1000px; margin: 40px auto; padding: 0 20px; color: #fff; font-family: sans-serif;">
      <article>
        <h1 style="font-size: 36px; font-weight: 800; margin-bottom: 12px; color: #fff;">${movie.title} (${movie.releaseYear})</h1>
        <div style="display: flex; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; color: #A5A7B0; font-size: 14px;">
          <span><strong>Year:</strong> ${movie.releaseYear}</span>
          ${movie.runtime ? `<span>• <strong>Runtime:</strong> ${movie.runtime} min</span>` : ""}
          <span>• <strong>Language:</strong> ${movie.language}</span>
          <span>• <strong>Industry:</strong> ${movie.industry}</span>
          ${movie.imdbRating ? `<span>• <strong style="color: #FFD21F;">IMDb Rating:</strong> ${movie.imdbRating.toFixed(1)}/10</span>` : ""}
        </div>
        <div style="display: flex; gap: 30px; flex-wrap: wrap; margin-bottom: 30px;">
          <div style="flex: 0 0 260px;">
            <img src="${posterUrl}" alt="${movie.title} (${movie.releaseYear}) Official Movie Poster" width="260" height="390" style="border-radius: 12px; width: 100%; height: auto; border: 1px solid #333;" />
          </div>
          <div style="flex: 1; min-width: 280px;">
            <section style="margin-bottom: 24px;">
              <h2 style="font-size: 20px; font-weight: 700; color: #FFD21F; margin-bottom: 8px;">Synopsis & Overview</h2>
              <p style="color: #A5A7B0; font-size: 16px; line-height: 1.6;">${movie.description}</p>
            </section>
            <section style="margin-bottom: 20px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #FFD21F; margin-bottom: 6px;">Director & Cast</h2>
              <p style="margin-bottom: 6px;"><strong>Director:</strong> ${movie.director}</p>
              <p><strong>Main Cast:</strong> ${movie.cast.join(", ")}</p>
            </section>
            <section style="margin-bottom: 20px;">
              <h2 style="font-size: 18px; font-weight: 700; color: #FFD21F; margin-bottom: 6px;">Genres</h2>
              <p>${movie.genres.map(g => `<a href="${SITE_URL}/movies?genre=${encodeURIComponent(g)}" style="color: #FFD21F; text-decoration: underline; margin-right: 8px;">${g}</a>`).join("")}</p>
            </section>
            <section style="margin-top: 30px; padding: 20px; background: #11131A; border-radius: 12px; border: 1px solid #222;">
              <h2 style="font-size: 20px; font-weight: 700; color: #fff; margin-bottom: 12px;">Where to Watch ${movie.title}</h2>
              <ul style="list-style: none; padding: 0; margin: 0;">
                ${watchOptionsList}
              </ul>
            </section>
          </div>
        </div>
      </article>
      <footer style="margin-top: 40px; border-top: 1px solid #222; padding-top: 20px; text-align: center;">
        <a href="${SITE_URL}/movies" style="color: #FFD21F; font-weight: 600; text-decoration: none;">&larr; Back to All Movies</a>
      </footer>
    </main>
  `;

  const html = injectMetadata(template, {
    title,
    description,
    canonicalUrl,
    ogImage: posterUrl,
    ogType: "video.movie",
    schema: movieSchema,
    crawlableContent,
  });

  fs.writeFileSync(path.join(movieDir, "index.html"), html, "utf-8");
}

console.log(`Successfully generated crawlable prerendered HTML for all ${movies.length} movie routes!`);
