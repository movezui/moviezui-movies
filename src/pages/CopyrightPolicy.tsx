// src/pages/CopyrightPolicy.tsx
import { ShieldCheck, FileWarning, Mail, CheckCircle2, AlertTriangle, Scale } from "lucide-react";
import SEO from "../components/common/SEO";
import { SITE_CONFIG } from "../config/site";
import { createBreadcrumbSchema } from "../utils/schema";

export default function CopyrightPolicy() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Copyright Policy", path: "/copyright-policy" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <SEO
        title="Copyright Policy & DMCA Takedown Notice"
        description="Moviezui Intellectual Property and Copyright Policy. Procedure for submitting copyright infringement notices, content corrections, and DMCA removal requests."
        canonicalPath="/copyright-policy"
        schema={breadcrumbSchema}
      />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Scale size={14} />
          <span>Intellectual Property</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Copyright & DMCA Policy
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text">
          Effective Date: November 2026 | Last Updated: November 2026
        </p>
      </div>

      {/* Advisory Note */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 block mb-0.5">Policy Scope:</span>
          Moviezui respects the intellectual property rights of filmmakers, studios, artists, and distributors worldwide. This policy outlines our procedure for reporting alleged copyright infringement and submitting content removal or correction requests in good faith.
        </div>
      </div>

      {/* Policy Sections */}
      <div className="space-y-8 text-sm sm:text-base text-secondary-text leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <ShieldCheck size={18} className="text-primary" />
            <span>1. Respect for Intellectual Property</span>
          </h2>
          <p>
            Moviezui is an informational movie discovery platform. We do not host, store, broadcast, or transmit any video, audio, or media streams on our servers. All movie promotional posters, official titles, character names, and trade names referenced on this website are the property of their respective copyright holders and studios, used strictly for identification and commentary purposes under fair use doctrine.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <FileWarning size={18} className="text-primary" />
            <span>2. Infringement Notification Procedure</span>
          </h2>
          <p>
            If you are a copyright owner, producer, or authorized agent and believe that any promotional image, text description, or link on Moviezui infringes upon your copyright, you may submit a formal notification to our designated copyright contact.
          </p>
          <div className="space-y-2 p-5 rounded-2xl bg-card border border-white/5 text-xs sm:text-sm">
            <p className="font-semibold text-white">To expedite review, please include the following in your written notice:</p>
            <ol className="list-decimal pl-5 space-y-1.5 text-secondary-text">
              <li>
                <strong className="text-white">Identification of Work:</strong> A clear description of the copyrighted work claimed to have been infringed (e.g. movie title, release year, producer).
              </li>
              <li>
                <strong className="text-white">Specific URL(s):</strong> The exact URL on Moviezui where the allegedly infringing material appears (e.g. <code className="text-primary bg-backgroundSecondary px-1.5 py-0.5 rounded">https://moviezui.netlify.app/movie/your-film-slug</code>).
              </li>
              <li>
                <strong className="text-white">Contact Information:</strong> Your full name, company/studio name, mailing address, telephone number, and email address.
              </li>
              <li>
                <strong className="text-white">Good Faith Statement:</strong> A statement that you have a good-faith belief that use of the material in the manner complained of is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                <strong className="text-white">Accuracy Statement:</strong> A statement, under penalty of perjury, that the information in the notification is accurate and that you are the copyright owner or authorized to act on their behalf.
              </li>
              <li>
                <strong className="text-white">Signature:</strong> A physical or electronic signature of the authorized copyright owner or representative.
              </li>
            </ol>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Mail size={18} className="text-primary" />
            <span>3. Designated Copyright Contact</span>
          </h2>
          <p>
            Please direct all copyright complaints and DMCA takedown requests to our designated email address:
          </p>
          <div className="p-4 rounded-xl bg-card border border-white/5 space-y-1 font-mono text-xs text-white/90">
            <div>Moviezui Copyright & Intellectual Property Review</div>
            <div>
              Email:{" "}
              <a href={`mailto:${SITE_CONFIG.contact.legalEmail}`} className="text-primary hover:underline">
                {SITE_CONFIG.contact.legalEmail}
              </a>
            </div>
            <div>Subject Line: [Copyright Notice] Moviezui Content</div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <CheckCircle2 size={18} className="text-primary" />
            <span>4. Review and Removal Actions</span>
          </h2>
          <p>
            Upon receipt of a valid and actionable notification complying with the requirements above, Moviezui will investigate promptly. If substantiated, we will remove or disable access to the challenged material, update metadata, or correct links as requested within a reasonable timeframe.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">5. Counter-Notification Procedure</h2>
          <p>
            If a content contributor or authorized distributor believes that material was removed or disabled as a result of mistake or misidentification, a counter-notification may be submitted containing their identity, identification of the removed item, and consent to legal jurisdiction.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">6. Content Corrections (Non-Infringing)</h2>
          <p>
            If your request is not a copyright claim but simply a factual correction (e.g. updating a director credit, correcting release year, or updating an official poster), please use our dedicated{" "}
            <a href="/contact" className="text-primary hover:underline">
              Contact Form
            </a>{" "}
            under &quot;Movie Information Corrections.&quot;
          </p>
        </section>
      </div>
    </div>
  );
}
