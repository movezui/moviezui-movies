// src/pages/Terms.tsx
import { FileCheck, Shield, AlertTriangle, ExternalLink, Scale, CheckCircle2 } from "lucide-react";
import SEO from "../components/common/SEO";
import { SITE_CONFIG } from "../config/site";
import { createBreadcrumbSchema } from "../utils/schema";

export default function Terms() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Terms and Conditions", path: "/terms" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <SEO
        title="Terms and Conditions"
        description="Review the Moviezui Terms and Conditions governing your access and use of our movie discovery platform, metadata guidelines, and external streaming link disclaimers."
        canonicalPath="/terms"
        schema={breadcrumbSchema}
      />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Scale size={14} />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Terms and Conditions
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text">
          Effective Date: November 2026 | Last Updated: November 2026
        </p>
      </div>

      {/* Legal Advisory */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 block mb-0.5">Legal Advisory:</span>
          These Terms and Conditions constitute a legally binding agreement between you and Moviezui. We recommend independent legal counsel review prior to entering formal commercial transactions or distributor partnerships.
        </div>
      </div>

      {/* Terms Body */}
      <div className="space-y-8 text-sm sm:text-base text-secondary-text leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <CheckCircle2 size={18} className="text-primary" />
            <span>1. Acceptance of Terms</span>
          </h2>
          <p>
            By accessing or using Moviezui (&quot;the Website&quot;, &quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) at {SITE_CONFIG.siteUrl}, you confirm that you have read, understood, and agree to be bound by these Terms and Conditions and our Privacy Policy. If you do not agree to these terms, please discontinue use of the Website immediately.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <FileCheck size={18} className="text-primary" />
            <span>2. Purpose of Moviezui</span>
          </h2>
          <p>
            Moviezui is an informational movie discovery platform designed to help cinema enthusiasts explore movies across world film industries, browse authentic cast and director details, and discover legitimate platforms where titles can be streamed, rented, or purchased.
          </p>
          <p className="p-4 rounded-xl bg-card border border-white/5 text-white/90 font-normal text-xs sm:text-sm">
            <strong>Important Clarification:</strong> Moviezui is not a movie streaming service, video host, or media distributor. We do not host, broadcast, upload, or transmit any video, audio, or media streams on our servers.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">3. Permitted and Prohibited Use</h2>
          <p>
            You are granted a non-exclusive, non-transferable, revocable license to access and browse the Website for personal, non-commercial movie discovery purposes.
          </p>
          <div className="space-y-1.5 pl-4 border-l-2 border-white/10 text-xs sm:text-sm">
            <p><strong className="text-white font-medium">Prohibited Activities include:</strong></p>
            <ul className="list-disc pl-5 space-y-1 text-secondary-text">
              <li>Using automated scripts, scrapers, crawlers, or bots to harvest catalog metadata in a manner that degrades server performance;</li>
              <li>Attempting to probe, scan, or breach website security or bypass rate limits;</li>
              <li>Impersonating Moviezui or misrepresenting affiliation with our brand;</li>
              <li>Using the Website for any unlawful, defamatory, or fraudulent purpose.</li>
            </ul>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Shield size={18} className="text-primary" />
            <span>4. Intellectual Property and Third-Party Assets</span>
          </h2>
          <p>
            All original website design elements, code, styling, text content, logos, and UI components are the intellectual property of Moviezui and protected by copyright and intellectual property laws.
          </p>
          <p>
            Movie titles, descriptions, character names, director/cast credits, and promotional movie posters displayed on Moviezui remain the copyrighted property and trademarks of their respective film studios, producers, and distributors. Such assets are referenced strictly for identification, commentary, and informational discovery under fair use principles.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <ExternalLink size={18} className="text-primary" />
            <span>5. External Streaming Links and Third-Party Services</span>
          </h2>
          <p>
            Moviezui indexes and provides hyperlinks to third-party digital platforms (such as Netflix, Amazon Prime Video, JioHotstar, ZEE5, Sony LIV, YouTube Movies, Apple TV, ShemarooMe, and others).
          </p>
          <p>
            We do not control, operate, or endorse third-party platforms. Digital rights, licensing windows, subscription tiers, pricing, and regional geo-availability change frequently without prior notice. Moviezui accepts no responsibility for content, service quality, price alterations, or transaction disputes occurring on third-party platforms.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">6. Accuracy and Disclaimers</h2>
          <p>
            While Moviezui rigorously audits movie metadata and streaming availability, all information is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, whether express or implied. Users are encouraged to verify streaming availability directly on the respective service provider.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, Moviezui, its founders, and contributors shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to, use of, or inability to access the Website or external links.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">8. Modifications to Terms</h2>
          <p>
            We reserve the right to amend or update these Terms and Conditions at any time. Continued use of Moviezui following any changes signifies your acceptance of the revised terms.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">9. Contact and Legal Notices</h2>
          <p>
            For legal notices, terms inquiries, or licensing questions, please contact:
          </p>
          <div className="p-4 rounded-xl bg-card border border-white/5 space-y-1 font-mono text-xs text-white/90">
            <div>Moviezui Legal Department</div>
            <div>
              Email:{" "}
              <a href={`mailto:${SITE_CONFIG.contact.legalEmail}`} className="text-primary hover:underline">
                {SITE_CONFIG.contact.legalEmail}
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
