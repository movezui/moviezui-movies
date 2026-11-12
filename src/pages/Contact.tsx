// src/pages/Contact.tsx
import { useState } from "react";
import {
  Mail,
  Send,
  HelpCircle,
  FileEdit,
  Tv,
  ShieldAlert,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import SEO from "../components/common/SEO";
import { SITE_CONFIG } from "../config/site";
import { createBreadcrumbSchema } from "../utils/schema";

type InquiryType =
  | "general"
  | "movie_correction"
  | "streaming_correction"
  | "copyright"
  | "business";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "general" as InquiryType,
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Contact Us", path: "/contact" },
  ]);

  const validate = () => {
    const errs: Record<string, string> = {};

    if (!formData.name.trim() || formData.name.trim().length < 2) {
      errs.name = "Please enter your name (at least 2 characters).";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      errs.email = "Please enter a valid email address.";
    }

    if (!formData.subject.trim() || formData.subject.trim().length < 3) {
      errs.subject = "Please enter a subject (at least 3 characters).";
    }

    if (!formData.message.trim() || formData.message.trim().length < 15) {
      errs.message = "Please provide more details in your message (at least 15 characters).";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmissionError(null);

    if (!validate()) {
      return;
    }

    // Since this is a client-side Vite SPA without a dedicated email microservice connected yet,
    // we construct a prefilled mailto link so the inquiry can be dispatched reliably from the user's client,
    // while also presenting a clear success state and configuration note for server-side integration.
    try {
      const recipient =
        formData.type === "copyright"
          ? SITE_CONFIG.contact.legalEmail
          : formData.type === "business"
          ? SITE_CONFIG.contact.pressEmail
          : SITE_CONFIG.contact.email;

      const mailtoSubject = encodeURIComponent(`[Moviezui ${formData.type.toUpperCase()}] ${formData.subject}`);
      const mailtoBody = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nInquiry Type: ${formData.type}\n\nMessage:\n${formData.message}`
      );

      // Trigger mailto client
      window.location.href = `mailto:${recipient}?subject=${mailtoSubject}&body=${mailtoBody}`;
      setSubmitted(true);
    } catch {
      setSubmissionError("Could not initiate email dispatch. Please reach out directly to " + SITE_CONFIG.contact.email);
    }
  };

  const inquiryCategories = [
    {
      id: "general",
      title: "General Inquiries",
      desc: "Questions about the Moviezui platform, features, or suggestions.",
      icon: <HelpCircle size={18} className="text-primary" />,
    },
    {
      id: "movie_correction",
      title: "Movie Information Corrections",
      desc: "Report an inaccurate release year, director, cast list, or title typo.",
      icon: <FileEdit size={18} className="text-sky-400" />,
    },
    {
      id: "streaming_correction",
      title: "Streaming Availability Corrections",
      desc: "Report a newly added, expired, or region-restricted streaming link.",
      icon: <Tv size={18} className="text-amber-400" />,
    },
    {
      id: "copyright",
      title: "Copyright & Content Concerns",
      desc: "DMCA takedown notices, intellectual property or attribution requests.",
      icon: <ShieldAlert size={18} className="text-secondary" />,
    },
    {
      id: "business",
      title: "Business & Partnerships",
      desc: "Distributor partnerships, platform collaborations, or press.",
      icon: <Briefcase size={18} className="text-emerald-400" />,
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      <SEO
        title="Contact Us – Inquiries & Movie Information Corrections"
        description="Get in touch with Moviezui. Send movie corrections, streaming availability updates, copyright inquiries, or partnership proposals."
        canonicalPath="/contact"
        schema={breadcrumbSchema}
      />

      {/* Header */}
      <section className="relative py-14 sm:py-20 border-b border-white/5 bg-gradient-to-b from-backgroundSecondary/60 via-background to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Mail size={14} />
            <span>Get in Touch</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-white tracking-tight">
            Contact Moviezui
          </h1>

          <p className="text-sm sm:text-base text-secondary-text max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, movie data correction, or streaming link update? We value community feedback and respond as quickly as possible.
          </p>
        </div>
      </section>

      {/* Content Area */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Categories and Direct Email */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-bold font-heading text-white">How Can We Help You?</h2>
              <p className="text-xs sm:text-sm text-secondary-text">
                Select an inquiry type so your message reaches the appropriate team directly.
              </p>
            </div>

            <div className="space-y-3">
              {inquiryCategories.map((cat) => (
                <div
                  key={cat.id}
                  onClick={() => setFormData({ ...formData, type: cat.id as InquiryType })}
                  className={`p-4 rounded-xl border transition cursor-pointer flex items-start space-x-3.5 ${
                    formData.type === cat.id
                      ? "bg-primary/10 border-primary text-white"
                      : "bg-card/60 border-white/5 text-secondary-text hover:border-white/20 hover:text-white"
                  }`}
                >
                  <div className="shrink-0 mt-0.5">{cat.icon}</div>
                  <div className="space-y-0.5 text-xs sm:text-sm">
                    <span className="font-semibold text-white block">{cat.title}</span>
                    <span className="text-xs text-secondary-text leading-relaxed">{cat.desc}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Direct Channel Configs Note */}
            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-3 text-xs">
              <h3 className="font-semibold text-white flex items-center space-x-2">
                <Sparkles size={14} className="text-primary" />
                <span>Direct Contact Channels</span>
              </h3>
              <p className="text-secondary-text leading-relaxed">
                You can also email our teams directly at:
              </p>
              <div className="space-y-1.5 font-mono text-[11px] text-white/90">
                <div>
                  <span className="text-secondary-text font-sans">General: </span>
                  <a href={`mailto:${SITE_CONFIG.contact.email}`} className="text-primary hover:underline">
                    {SITE_CONFIG.contact.email}
                  </a>
                </div>
                <div>
                  <span className="text-secondary-text font-sans">Legal & DMCA: </span>
                  <a href={`mailto:${SITE_CONFIG.contact.legalEmail}`} className="text-primary hover:underline">
                    {SITE_CONFIG.contact.legalEmail}
                  </a>
                </div>
                <div>
                  <span className="text-secondary-text font-sans">Partnerships: </span>
                  <a href={`mailto:${SITE_CONFIG.contact.pressEmail}`} className="text-primary hover:underline">
                    {SITE_CONFIG.contact.pressEmail}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-card/80 border border-white/10 shadow-xl space-y-6">
              <div className="space-y-1">
                <h2 className="text-xl sm:text-2xl font-bold font-heading text-white">Send Us a Message</h2>
                <p className="text-xs sm:text-sm text-secondary-text">
                  Fill in the details below. We review corrections and user inquiries carefully.
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-white">Inquiry Prepared</h3>
                  <p className="text-xs sm:text-sm text-secondary-text max-w-md mx-auto leading-relaxed">
                    Your inquiry has been formulated. If your default email client did not open automatically, please send your note directly to{" "}
                    <span className="text-primary font-medium">{SITE_CONFIG.contact.email}</span> with your subject line.
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        type: "general",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-card border border-white/10 hover:border-white/30 text-white text-xs font-semibold transition"
                  >
                    <span>Send Another Inquiry</span>
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submissionError && (
                    <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center space-x-2">
                      <AlertCircle size={16} className="shrink-0" />
                      <span>{submissionError}</span>
                    </div>
                  )}

                  {/* Name and Email Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="name" className="block text-xs font-medium text-white/90">
                        Your Name <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white placeholder-secondary-text/60 border text-sm transition focus:outline-none focus:ring-1 ${
                          errors.name ? "border-red-500/60 focus:ring-red-500" : "border-white/10 focus:border-primary focus:ring-primary"
                        }`}
                      />
                      {errors.name && <p className="text-[11px] text-red-400">{errors.name}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <label htmlFor="email" className="block text-xs font-medium text-white/90">
                        Email Address <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. rahul@example.com"
                        className={`w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white placeholder-secondary-text/60 border text-sm transition focus:outline-none focus:ring-1 ${
                          errors.email ? "border-red-500/60 focus:ring-red-500" : "border-white/10 focus:border-primary focus:ring-primary"
                        }`}
                      />
                      {errors.email && <p className="text-[11px] text-red-400">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Inquiry Type Selector */}
                  <div className="space-y-1.5">
                    <label htmlFor="inquiryType" className="block text-xs font-medium text-white/90">
                      Inquiry Category <span className="text-secondary">*</span>
                    </label>
                    <select
                      id="inquiryType"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as InquiryType })}
                      className="w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white border border-white/10 text-sm focus:outline-none focus:border-primary"
                    >
                      <option value="general">General Inquiries</option>
                      <option value="movie_correction">Movie Information Correction</option>
                      <option value="streaming_correction">Streaming Availability Correction</option>
                      <option value="copyright">Copyright / Content Concern</option>
                      <option value="business">Business & Partnerships</option>
                    </select>
                  </div>

                  {/* Subject */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className="block text-xs font-medium text-white/90">
                      Subject <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Update streaming platform for Reva (2018)"
                      className={`w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white placeholder-secondary-text/60 border text-sm transition focus:outline-none focus:ring-1 ${
                        errors.subject ? "border-red-500/60 focus:ring-red-500" : "border-white/10 focus:border-primary focus:ring-primary"
                      }`}
                    />
                    {errors.subject && <p className="text-[11px] text-red-400">{errors.subject}</p>}
                  </div>

                  {/* Message */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className="block text-xs font-medium text-white/90">
                      Message Details <span className="text-secondary">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please include movie title, year, platform name, or specific details..."
                      className={`w-full px-4 py-2.5 rounded-xl bg-backgroundSecondary text-white placeholder-secondary-text/60 border text-sm transition focus:outline-none focus:ring-1 ${
                        errors.message ? "border-red-500/60 focus:ring-red-500" : "border-white/10 focus:border-primary focus:ring-primary"
                      }`}
                    />
                    {errors.message && <p className="text-[11px] text-red-400">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-sm transition shadow-lg shadow-primary/10 cursor-pointer"
                  >
                    <span>Send Message</span>
                    <Send size={16} />
                  </button>

                  <p className="text-[11px] text-secondary-text text-center pt-2">
                    By submitting this form, you acknowledge that inquiries are handled in accordance with our{" "}
                    <a href="/privacy-policy" className="text-white hover:underline">
                      Privacy Policy
                    </a>.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
