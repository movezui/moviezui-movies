// src/config/site.ts
/**
 * Moviezui Global Site Configuration
 * 
 * Centralized settings for canonical URLs, SEO metadata, contact channels,
 * and search engine verification tokens.
 * 
 * Configurable via environment variables (VITE_SITE_URL, VITE_GSC_VERIFICATION_TOKEN)
 * or by updating the default values below before public launch.
 */

export interface SiteConfig {
  name: string;
  tagline: string;
  description: string;
  siteUrl: string;
  contact: {
    email: string;
    legalEmail: string;
    pressEmail: string;
    phone?: string; // Optional: not configured by default
    address?: string; // Optional: not configured by default
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
    defaultImage: string;
    twitterHandle?: string;
    googleSearchConsoleToken?: string;
  };
}

export const SITE_CONFIG: SiteConfig = {
  name: "Moviezui",
  tagline: "Discover Movies From Around The World",
  description:
    "Moviezui is a premier global movie discovery platform helping cinema lovers explore films across languages, industries, and genres with authentic details and verified streaming options.",
  // Production domain: defaults to https://moviezui.netlify.app, overridable with VITE_SITE_URL
  siteUrl: (typeof import.meta !== "undefined" && import.meta.env?.VITE_SITE_URL) || "https://moviezui.netlify.app",
  contact: {
    // Configurable email endpoints for contact forms, corrections, and inquiries
    email: "bestfoodvloggers@gmail.com",
    legalEmail: "bestfoodvloggers@gmail.com",
    pressEmail: "bestfoodvloggers@gmail.com",
  },
  seo: {
    defaultTitle: "Moviezui – Discover Movies From Around The World",
    titleTemplate: "%s | Moviezui",
    defaultDescription:
      "Explore movies across Hindi, English, Gujarati, Tamil, Telugu, Malayalam, Kannada, Punjabi, Bengali, Marathi and international cinema with verified where to watch streaming availability.",
    defaultImage: "/logo.jpg",
    // Configurable token: Supply actual GSC verification code in environment or config
    googleSearchConsoleToken: (typeof import.meta !== "undefined" && import.meta.env?.VITE_GSC_VERIFICATION_TOKEN) || "",
  },
};

export default SITE_CONFIG;
