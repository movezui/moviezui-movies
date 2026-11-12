// src/pages/Disclaimer.tsx
import { AlertCircle, Film, Tv, ExternalLink, HelpCircle, ShieldCheck } from "lucide-react";
import SEO from "../components/common/SEO";
import { SITE_CONFIG } from "../config/site";
import { createBreadcrumbSchema } from "../utils/schema";

export default function Disclaimer() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Disclaimer", path: "/disclaimer" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <SEO
        title="Disclaimer – Informational & Streaming Availability Notice"
        description="Important informational disclaimers regarding Moviezui movie data, third-party streaming links, licensing windows, and external platform redirection."
        canonicalPath="/disclaimer"
        schema={breadcrumbSchema}
      />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <AlertCircle size={14} />
          <span>Platform Disclaimers</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Disclaimer
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text">
          Last Updated: November 2026
        </p>
      </div>

      {/* Highlights Box */}
      <div className="p-6 rounded-3xl bg-card border border-white/10 shadow-lg space-y-4">
        <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
          <Film size={18} className="text-primary" />
          <span>Core Notice Regarding Moviezui Services</span>
        </h2>
        <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
          Moviezui is strictly an independent, informational movie discovery platform. We do not host, store, stream, or broadcast video files or audio media on our infrastructure.
        </p>
      </div>

      {/* Main Sections */}
      <div className="space-y-8 text-sm sm:text-base text-secondary-text leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Tv size={18} className="text-primary" />
            <span>1. Informational and Discovery Purpose Only</span>
          </h2>
          <p>
            All content on Moviezui—including movie titles, release years, plot summaries, cast and director rosters, genre classifications, and ratings—is published solely for personal discovery, educational, and informational purposes.
          </p>
          <p>
            While we make every effort to maintain accurate and up-to-date records, Moviezui makes no representations or warranties regarding the completeness, timeliness, or accuracy of any catalog information.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <ExternalLink size={18} className="text-primary" />
            <span>2. External Streaming Links and Redirection</span>
          </h2>
          <p>
            Our &quot;Where to Watch&quot; section indexes verified third-party streaming services (such as Netflix, Amazon Prime Video, JioHotstar, ZEE5, Sony LIV, YouTube Movies, Apple TV, ShemarooMe, Sun NXT, Hoichoi, and others).
          </p>
          <p>
            When you click &quot;Watch Now&quot; or external platform buttons, you leave Moviezui and are redirected to an external third-party website or app.
          </p>
          <div className="space-y-2 pl-4 border-l-2 border-white/10 text-xs sm:text-sm text-secondary-text">
            <div>• <strong className="text-white">Independent Ownership:</strong> Moviezui does not own, manage, control, or operate these third-party platforms.</div>
            <div>• <strong className="text-white">Pricing & Tiers:</strong> Subscription prices, rental fees, and purchase rates are set exclusively by the respective streaming provider and may change without notice.</div>
            <div>• <strong className="text-white">Licensing Expirations:</strong> Film distribution licenses expire, rotate, or alter territory restrictions regularly. A title available today may rotate out of a catalog tomorrow.</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <ShieldCheck size={18} className="text-primary" />
            <span>3. Ratings and Metadata Changes</span>
          </h2>
          <p>
            IMDb ratings and third-party scores displayed on Moviezui reflect recorded ratings at the time of catalog audit. Ratings fluctuate continuously based on audience voting and distributor updates on primary rating databases. Where verified ratings are unavailable, Moviezui marks titles as unrated rather than fabricating scores.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <HelpCircle size={18} className="text-primary" />
            <span>4. User Responsibility</span>
          </h2>
          <p>
            Users are encouraged to verify streaming options, regional compatibility, subscription requirements, and content ratings directly on the respective platform before making purchasing or rental decisions. Moviezui shall not be responsible or liable for any transaction, subscription fee, or streaming experience provided by third parties.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">5. Corrections and Feedback</h2>
          <p>
            If you notice a streaming link that has recently expired, a newly available platform, or a metadata error, please notify our team via our{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact Us page
            </a>{" "}
            or email{" "}
            <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-primary hover:underline">
              {SITE_CONFIG.contact.email}
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
