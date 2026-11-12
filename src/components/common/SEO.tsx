// src/components/common/SEO.tsx
import { useEffect } from "react";
import { SITE_CONFIG } from "../../config/site";

export interface SEOProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: "website" | "video.movie" | "article";
  noindex?: boolean;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * SEO component for managing dynamic meta tags, canonical links,
 * Open Graph, Twitter cards, and Schema.org JSON-LD in the document head.
 */
export default function SEO({
  title,
  description,
  canonicalPath = "",
  ogImage,
  ogType = "website",
  noindex = false,
  schema,
}: SEOProps) {
  useEffect(() => {
    // 1. Format page title
    const fullTitle = title
      ? `${title} | ${SITE_CONFIG.name}`
      : SITE_CONFIG.seo.defaultTitle;
    document.title = fullTitle;

    const fullDescription = description || SITE_CONFIG.seo.defaultDescription;
    const cleanPath = canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`;
    const canonicalUrl = `${SITE_CONFIG.siteUrl}${cleanPath === "/" ? "" : cleanPath}`;
    const image = ogImage
      ? ogImage.startsWith("http")
        ? ogImage
        : `${SITE_CONFIG.siteUrl}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`
      : `${SITE_CONFIG.siteUrl}${SITE_CONFIG.seo.defaultImage}`;

    // Helper to set or create a meta tag
    const setMetaTag = (attribute: "name" | "property", value: string, content: string) => {
      let element = document.querySelector(`meta[${attribute}="${value}"]`) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attribute, value);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // 2. Standard Meta Tags
    setMetaTag("name", "description", fullDescription);
    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    // 3. Canonical Link
    let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", canonicalUrl);

    // 4. Open Graph Meta Tags
    setMetaTag("property", "og:site_name", SITE_CONFIG.name);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", fullDescription);
    setMetaTag("property", "og:url", canonicalUrl);
    setMetaTag("property", "og:type", ogType);
    setMetaTag("property", "og:image", image);

    // 5. Twitter Card Meta Tags
    setMetaTag("name", "twitter:card", "summary_large_image");
    setMetaTag("name", "twitter:title", fullTitle);
    setMetaTag("name", "twitter:description", fullDescription);
    setMetaTag("name", "twitter:image", image);

    // 6. JSON-LD Structured Data
    const scriptId = "moviezui-structured-data";
    let scriptElement = document.getElementById(scriptId) as HTMLScriptElement | null;

    if (schema) {
      if (!scriptElement) {
        scriptElement = document.createElement("script");
        scriptElement.id = scriptId;
        scriptElement.type = "application/ld+json";
        document.head.appendChild(scriptElement);
      }
      scriptElement.text = JSON.stringify(schema);
    } else if (scriptElement) {
      scriptElement.remove();
    }

    return () => {
      // Cleanup on unmount if needed
    };
  }, [title, description, canonicalPath, ogImage, ogType, noindex, schema]);

  return null;
}
