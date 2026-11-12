// src/pages/About.tsx
import { Link } from "react-router-dom";
import {
  Globe,
  Film,
  Tv,
  Search,
  Compass,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Clapperboard,
  Users,
} from "lucide-react";
import SEO from "../components/common/SEO";
import { createOrganizationSchema, createBreadcrumbSchema } from "../utils/schema";

export default function About() {
  const breadcrumbSchema = createBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about" },
  ]);
  const orgSchema = createOrganizationSchema();

  return (
    <div className="space-y-16 sm:space-y-20 pb-20">
      <SEO
        title="About Us – Global Movie Discovery Platform"
        description="Learn about Moviezui, our mission to make world cinema discoverable across languages and industries, our verified Where to Watch feature, and our commitment to accurate movie information."
        canonicalPath="/about"
        schema={[orgSchema, breadcrumbSchema]}
      />

      {/* Hero Header */}
      <section className="relative py-16 sm:py-20 md:py-28 overflow-hidden border-b border-white/5 bg-gradient-to-b from-backgroundSecondary/70 via-background to-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles size={14} className="fill-primary" />
            <span>Discover Cinema Without Borders</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Connecting Movie Lovers to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-amber-500">
              World Cinema
            </span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-secondary-text max-w-2xl mx-auto leading-relaxed font-light">
            Moviezui is a movie discovery platform designed to help movie lovers explore cinema from around the world.
          </p>

          <div className="pt-2 flex justify-center">
            <div className="p-3 rounded-2xl bg-card border border-white/10 shadow-2xl flex items-center space-x-3.5">
              <img
                src="/logo.jpg"
                alt="Moviezui Logo"
                className="h-12 w-auto object-contain rounded-lg"
              />
              <div className="text-left pr-3">
                <span className="block text-base font-bold text-white font-heading">
                  MOVIE<span className="text-primary">ZUI</span>
                </span>
                <span className="block text-xs text-secondary-text">Global Movie Discovery Platform</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-primary text-xs font-semibold">
            What You Can Do
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white">
            Everything You Need to Explore Cinema
          </h2>
          <p className="text-sm sm:text-base text-secondary-text">
            From discovering rare regional gems to finding where a blockbuster is streaming right now, Moviezui brings clarity to your movie journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Feature 1 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-card border border-white/5 space-y-4 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <Globe size={24} />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">1. Global Movie Discovery</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Explore movies across Bollywood, Hollywood, Gujarati, Tamil, Telugu, Malayalam, Kannada, Punjabi, Bengali, Marathi, and international film industries. We believe great storytelling speaks every language.
              </p>
            </div>
            <div className="pt-2 text-xs text-primary font-medium flex items-center space-x-1">
              <span>Diverse cinematic traditions</span>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-card border border-white/5 space-y-4 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center text-secondary">
                <Film size={24} />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">2. Movie Information</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Access comprehensive story summaries, release years, language classifications, director credits, cast ensembles, authentic posters, and genuine IMDb ratings when verified.
              </p>
            </div>
            <div className="pt-2 text-xs text-secondary font-medium flex items-center space-x-1">
              <span>Authentic metadata</span>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-card border border-white/5 space-y-4 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Tv size={24} />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">3. Where to Watch</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Discover verified third-party streaming platforms offering subscription, rental, purchase, and free digital viewing. We link directly to official catalog pages while clearly clarifying that availability may vary by region and over time.
              </p>
            </div>
            <div className="pt-2 text-xs text-amber-400 font-medium flex items-center space-x-1">
              <span>Legitimate streaming options</span>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="p-6 sm:p-7 rounded-2xl bg-card border border-white/5 space-y-4 hover:border-primary/30 transition-all duration-300 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Search size={24} />
              </div>
              <h3 className="text-lg font-bold text-white font-heading">4. Movie Discovery</h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Find movies effortlessly with instant title search, genre exploration across 17+ categories, language filters, and contextual recommendations of similar films you will appreciate.
              </p>
            </div>
            <div className="pt-2 text-xs text-sky-400 font-medium flex items-center space-x-1">
              <span>Seamless exploration</span>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Purpose Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card/70 rounded-3xl border border-white/5 p-8 sm:p-10 md:p-12 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
                <Compass size={14} />
                <span>Our Mission</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
                Why Moviezui Exists
              </h2>
              <p className="text-sm sm:text-base text-secondary-text leading-relaxed font-light">
                Discovering movies today has become fragmented across countless fragmented catalogs, confusing licensing windows, and regional silos. Movie lovers spend more time searching what to watch and where it is available than actually enjoying the film.
              </p>
              <p className="text-sm sm:text-base text-secondary-text leading-relaxed font-light">
                Moviezui was built to solve this by creating a centralized, respectful, and organized directory. We celebrate Indian regional cinema alongside national and international classics, giving each storytelling tradition equal dignity and visibility.
              </p>
            </div>

            <div className="space-y-3.5">
              <div className="p-4 rounded-xl bg-backgroundSecondary border border-white/5 flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-white block">Make Discovering Movies Easier</span>
                  <span className="text-secondary-text">Fast, responsive search and clean filtering without algorithmic clutter.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-backgroundSecondary border border-white/5 flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-white block">Unite Languages & Industries</span>
                  <span className="text-secondary-text">Equal prominence for Gujarati, Hindi, English, Tamil, Telugu, Malayalam, Kannada, Punjabi, Bengali, and Marathi cinema.</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-backgroundSecondary border border-white/5 flex items-start space-x-3">
                <CheckCircle2 size={18} className="text-primary shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-white block">Organized, Useful Information</span>
                  <span className="text-secondary-text">Clear story overviews, factual credits, and genuine streaming destinations on every movie page.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-white/5 bg-backgroundSecondary/50 rounded-3xl p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 text-primary text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={16} />
              <span>Guiding Principles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
              Our Core Commitments
            </h2>
            <p className="text-sm text-secondary-text max-w-xl">
              We hold Moviezui to high standards of accuracy, transparency, and user respect.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base flex items-center space-x-2">
                <Clapperboard size={16} className="text-primary" />
                <span>Accurate Movie Information</span>
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                We independently verify release years, director credits, cast ensembles, and storyline overviews. Where ratings are unverified or unavailable, we display them honestly rather than fabricating data.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base flex items-center space-x-2">
                <Tv size={16} className="text-amber-400" />
                <span>Genuine Streaming Availability</span>
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Every streaming link is audited against legitimate digital distributors (Netflix, Amazon Prime Video, JioHotstar, ZEE5, Sony LIV, YouTube Movies, Apple TV, ShemarooMe, Sun NXT, Hoichoi, etc.). We never generate fake URLs or synthetic links.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base flex items-center space-x-2">
                <Users size={16} className="text-secondary" />
                <span>User-Friendly Experience</span>
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Moviezui is designed to be fast, responsive, legible, and dark-theme optimized on smartphones, tablets, laptops, and large desktop screens without distracting advertisements or popups.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-card border border-white/5 space-y-2">
              <h3 className="font-semibold text-white text-sm sm:text-base flex items-center space-x-2">
                <Sparkles size={16} className="text-primary" />
                <span>Continuous Improvements</span>
              </h3>
              <p className="text-xs sm:text-sm text-secondary-text leading-relaxed">
                Digital streaming rights expire and renew constantly. We maintain active monitoring and welcome community corrections to keep availability records fresh and dependable.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Explore CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-4">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 space-y-5">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Start Exploring World Cinema Today
          </h2>
          <p className="text-sm text-secondary-text max-w-md mx-auto leading-relaxed">
            Browse our growing catalog of 220+ curated titles, explore genres, and discover where to watch your next favorite film.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              to="/movies"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition shadow-lg shadow-primary/10"
            >
              <span>Browse All Movies</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/genres"
              className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-card text-white font-semibold text-sm border border-white/10 hover:border-primary/50 transition"
            >
              <span>Explore Genres</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
