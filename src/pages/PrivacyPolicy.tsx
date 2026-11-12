// src/pages/PrivacyPolicy.tsx
import { Shield, Lock, Eye, Link as LinkIcon, FileText, AlertTriangle } from "lucide-react";
import SEO from "../components/common/SEO";
import { SITE_CONFIG } from "../config/site";
import { createBreadcrumbSchema } from "../utils/schema";

export default function PrivacyPolicy() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Privacy Policy", path: "/privacy-policy" },
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <SEO
        title="Privacy Policy"
        description="Read the official Moviezui Privacy Policy. Learn how we handle voluntarily submitted inquiries, respect user privacy, and protect personal data."
        canonicalPath="/privacy-policy"
        schema={breadcrumbSchema}
      />

      {/* Header */}
      <div className="space-y-4 border-b border-white/10 pb-8">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
          <Shield size={14} />
          <span>Legal Documentation</span>
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs sm:text-sm text-secondary-text">
          Effective Date: November 2026 | Last Updated: November 2026
        </p>
      </div>

      {/* Legal Review Advisory Notice */}
      <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start space-x-3 text-xs sm:text-sm text-amber-200/90 leading-relaxed">
        <AlertTriangle size={18} className="text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-amber-300 block mb-0.5">Note on Legal Customization:</span>
          This privacy policy accurately reflects the technical data practices of Moviezui as a movie discovery platform. Before entering commercial partnerships or enabling advertising/analytics services, ensure final review by certified legal counsel to reflect your specific corporate entity and jurisdiction.
        </div>
      </div>

      {/* Body Content */}
      <div className="space-y-8 text-sm sm:text-base text-secondary-text leading-relaxed font-light">
        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Eye size={18} className="text-primary" />
            <span>1. Overview and Scope</span>
          </h2>
          <p>
            Welcome to Moviezui (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). Moviezui is a movie discovery platform designed to help cinema enthusiasts explore movies across world film industries and discover legitimate third-party streaming, rental, and purchase platforms.
          </p>
          <p>
            We are committed to maintaining user trust through transparent privacy practices. This Privacy Policy describes how we handle information collected when you access or use our website ({SITE_CONFIG.siteUrl}).
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <FileText size={18} className="text-primary" />
            <span>2. Information We Collect</span>
          </h2>
          <p>
            Moviezui is designed to provide an open, unrestricted movie discovery experience without requiring account creation, login, or personal registration.
          </p>
          <div className="space-y-2 pl-4 border-l-2 border-white/10">
            <div>
              <strong className="text-white font-medium">A. Voluntarily Submitted Information:</strong> When you send us an inquiry, report a movie correction, or contact our team via the Contact Us form or direct email, we collect the information you choose to provide (such as your name, email address, inquiry topic, and message content). We use this information solely to review, respond to, and resolve your communication.
            </div>
            <div>
              <strong className="text-white font-medium">B. Automated Technical Data:</strong> When your web browser loads pages on Moviezui, standard web server logs may temporarily process basic technical metadata (such as your browser user agent, IP address, operating system, and request timestamps) solely for operational reliability, server diagnostics, and DDoS protection.
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <Lock size={18} className="text-primary" />
            <span>3. Cookies and Analytics Technologies</span>
          </h2>
          <p>
            Moviezui does not deploy profiling cookies, behavioral marketing trackers, or invasive cross-site fingerprinting mechanisms.
          </p>
          <p>
            <strong className="text-white font-medium">Analytics Status:</strong> At this current release, third-party analytics (such as Google Analytics 4) and advertising tracking cookies are not active on Moviezui. If third-party privacy-preserving analytics or telemetry are configured in a future update, this policy and our Cookie Policy will be updated accordingly with explicit opt-out controls.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white flex items-center space-x-2">
            <LinkIcon size={18} className="text-primary" />
            <span>4. Third-Party Services and External Links</span>
          </h2>
          <p>
            Moviezui features &quot;Where to Watch&quot; buttons and links that direct users to third-party streaming services (including Netflix, Amazon Prime Video, JioHotstar, ZEE5, Sony LIV, YouTube, Apple TV, ShemarooMe, Hoichoi, Sun NXT, and others).
          </p>
          <p>
            Please note that these third-party platforms operate entirely independent websites, applications, and terms. Moviezui does not control, supervise, or accept liability for their data collection, privacy policies, cookie usage, or terms of service. We encourage you to review the privacy notices of any external platform you visit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">5. Data Retention and Security</h2>
          <p>
            Communication records received via email or contact forms are retained only for as long as necessary to address the inquiry, fulfill administrative obligations, or resolve intellectual property corrections. We employ industry-standard encryption (HTTPS/TLS) across all website traffic to protect data in transit.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">6. Your Privacy Rights</h2>
          <p>
            Depending on your jurisdiction (such as under the General Data Protection Regulation, the California Consumer Privacy Act, or the Indian Digital Personal Data Protection Act), you have rights regarding your personal information, including the right to request access, correction, or deletion of correspondence records we hold about you. To exercise these rights, please contact our legal team at{" "}
            <a href={`mailto:${SITE_CONFIG.contact.legalEmail}`} className="text-primary hover:underline">
              {SITE_CONFIG.contact.legalEmail}
            </a>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">7. Policy Updates</h2>
          <p>
            We may update this Privacy Policy periodically to reflect technological enhancements, operational changes, or legal requirements. Material updates will be indicated by the &quot;Last Updated&quot; date at the top of this document.
          </p>
        </section>

        <section className="space-y-3 border-t border-white/10 pt-6">
          <h2 className="text-lg sm:text-xl font-bold font-heading text-white">8. Contact Information</h2>
          <p>
            If you have questions, comments, or data privacy requests regarding this Privacy Policy, please reach out to us at:
          </p>
          <div className="p-4 rounded-xl bg-card border border-white/5 space-y-1 font-mono text-xs text-white/90">
            <div>Moviezui Privacy & Legal Team</div>
            <div>
              Email:{" "}
              <a href={`mailto:${SITE_CONFIG.contact.legalEmail}`} className="text-primary hover:underline">
                {SITE_CONFIG.contact.legalEmail}
              </a>
            </div>
            <div>Website: {SITE_CONFIG.siteUrl}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
