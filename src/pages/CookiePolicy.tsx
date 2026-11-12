// src/pages/CookiePolicy.tsx
import { Cookie, CheckCircle2, Shield, Settings, Info } from "lucide-react";
import SEO from "../components/common/SEO";
import { SITE_CONFIG } from "../config/site";
import { createBreadcrumbSchema } from "../utils/schema";

export default function CookiePolicy() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Cookie Policy", path: "/cookie-policy" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <SEO
        title="Cookie Policy – How Moviezui Uses Browser Technologies"
        description="Learn about the technical cookies and local browser storage used by Moviezui. We prioritize user privacy with zero advertising trackers."
        canonicalPath="/cookie-policy"
        schema={breadcrumbSchema}
      />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Cookie size={14} />
          <span>Technology & Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Cookie Policy
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text">
          Effective Date: November 2026 | Last Updated: November 2026
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-8 text-sm sm:text-base text-secondary-text leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Info size={18} className="text-primary" />
            <span>1. What Are Cookies?</span>
          </h2>
          <p>
            Cookies are small text files placed on your computer or mobile device by websites that you visit. They are widely used to make websites work efficiently, remember your preferences, and provide diagnostic performance data.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Shield size={18} className="text-primary" />
            <span>2. Our Privacy-First Stance</span>
          </h2>
          <p>
            Moviezui is built with a privacy-first engineering philosophy. We do not use cookies to profile your behavior, sell personal data, or serve targeted commercial advertisements.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <CheckCircle2 size={18} className="text-primary" />
            <span>3. Categories of Technologies Used</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base">A. Strictly Essential Technical Storage</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                We may use browser local storage or session storage strictly to remember interface states (such as active search queries, genre filters, or responsive drawer states during your session). These do not track you across other websites and do not transmit personal identifiers.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base">B. Analytics & Measurement Cookies</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                <strong className="text-white">Currently Disabled:</strong> Moviezui does not currently employ third-party behavioral analytics (such as Google Analytics 4) or commercial marketing cookies. If non-invasive analytics are introduced in the future to understand catalog popularity, this policy will be promptly updated with granular consent mechanisms.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base">C. Third-Party Destination Cookies</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                When you click external &quot;Where to Watch&quot; links (such as Netflix, Prime Video, JioHotstar, ZEE5, YouTube, Apple TV, etc.), those destination platforms may set cookies on your browser according to their respective cookie policies. Moviezui does not set or control these third-party cookies.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Settings size={18} className="text-primary" />
            <span>4. Managing Your Cookie Preferences</span>
          </h2>
          <p>
            Most modern web browsers allow you to control cookies through their configuration settings. You can instruct your browser to block or delete cookies:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-secondary-text">
            <li>Google Chrome: Settings &gt; Privacy and security &gt; Cookies and other site data</li>
            <li>Mozilla Firefox: Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection</li>
            <li>Apple Safari: Preferences &gt; Privacy &gt; Manage Website Data</li>
            <li>Microsoft Edge: Settings &gt; Cookies and site permissions</li>
          </ul>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">5. Contact Us</h2>
          <p>
            If you have questions regarding our use of cookies or local storage, please reach out to:
          </p>
          <div className="p-4 rounded-xl bg-card border border-white/5 font-mono text-xs text-white/90">
            Email:{" "}
            <a href={`mailto:${SITE_CONFIG.contact.legalEmail}`} className="text-primary hover:underline">
              {SITE_CONFIG.contact.legalEmail}
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
