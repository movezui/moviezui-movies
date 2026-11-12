// src/pages/About.tsx
import { Link } from "react-router-dom";
import { Film, Award, Heart, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Hero Header */}
      <section className="relative py-16 md:py-24 overflow-hidden border-b border-white/5 bg-gradient-to-b from-backgroundSecondary/60 via-background to-background">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold">
            <Sparkles size={14} className="fill-primary" />
            <span>About Moviezui</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold font-heading text-white tracking-tight">
            The Digital Home of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-yellow-300 to-amber-500">
              World Cinema
            </span>
          </h1>

          <p className="text-base sm:text-lg text-secondary-text max-w-2xl mx-auto leading-relaxed font-light">
            Moviezui was built with a singular, passionate mission: to create a world-class, beautifully designed movie discovery platform celebrating cinema across all languages, industries, and cultures.
          </p>

          <div className="pt-4 flex justify-center">
            <div className="relative p-2 rounded-2xl bg-card border border-white/10 shadow-2xl flex items-center space-x-3">
              <img
                src="/logo.jpg"
                alt="Moviezui Official Logo"
                className="h-12 w-auto object-contain rounded-lg"
              />
              <div className="text-left pr-4">
                <span className="block text-base font-bold text-white font-heading">
                  MOVIE<span className="text-primary">ZUI</span>
                </span>
                <span className="block text-[11px] text-secondary-text">Global Film Discovery Engine</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Mission & Story */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-card/60 p-8 md:p-12 rounded-3xl border border-white/5 shadow-xl">
          <div className="space-y-4">
            <div className="inline-block px-3 py-1 rounded-full bg-white/5 text-primary text-xs font-semibold">
              Our Mission
            </div>
            <h2 className="text-2xl md:text-3xl font-bold font-heading text-white">
              Giving Great Storytelling the Spotlight It Deserves
            </h2>
            <p className="text-sm md:text-base text-secondary-text leading-relaxed font-light">
              Cinema has the unique power to transcend borders, bridge cultures, and ignite imagination. From Gujarati national award winners like <em>Hellaro</em> and India&apos;s Oscar entry <em>Chhello Show</em> to Bollywood epics, South Indian blockbusters, and Hollywood masterpieces, stories connect humanity.
            </p>
            <p className="text-sm md:text-base text-secondary-text leading-relaxed font-light">
              Moviezui unites diverse cinematic traditions into an intuitive, elegant, and unified movie discovery portal designed for cinephiles and casual viewers alike.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-backgroundSecondary/80 border border-white/5 space-y-2">
              <Film size={24} className="text-primary" />
              <div className="text-xl font-bold text-white font-heading">Curated Data</div>
              <p className="text-xs text-secondary-text">
                Every title is verified with authentic casts, directors, runtimes, and IMDb ratings.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-backgroundSecondary/80 border border-white/5 space-y-2">
              <Award size={24} className="text-primary" />
              <div className="text-xl font-bold text-white font-heading">Acclaimed Films</div>
              <p className="text-xs text-secondary-text">
                Spotlighting award-winning period films, cultural folklore, and modern global blockbusters.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-backgroundSecondary/80 border border-white/5 space-y-2">
              <Heart size={24} className="text-secondary" />
              <div className="text-xl font-bold text-white font-heading">Diverse Cultures</div>
              <p className="text-xs text-secondary-text">
                Celebrating cinema in Hindi, English, Gujarati, Tamil, Telugu, Malayalam, Punjabi, and beyond.
              </p>
            </div>
            <div className="p-5 rounded-2xl bg-backgroundSecondary/80 border border-white/5 space-y-2">
              <ShieldCheck size={24} className="text-primary" />
              <div className="text-xl font-bold text-white font-heading">Zero Clutter</div>
              <p className="text-xs text-secondary-text">
                Ad-free, lightning fast, dark aesthetic designed for movie lovers and cinephiles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Brand Identity Specs */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-white/10 pb-4 mb-8">
          <h2 className="text-2xl font-bold font-heading text-white">Moviezui Brand Identity</h2>
          <p className="text-sm text-secondary-text">Official visual aesthetics and engineering standards.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-card border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-primary" />
            <h3 className="font-semibold text-white">Primary Accent</h3>
            <p className="text-xs text-secondary-text">Golden Glow (#FFD21F) symbolizing cinema lights and Gujarati heritage.</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-secondary" />
            <h3 className="font-semibold text-white">Secondary Accent</h3>
            <p className="text-xs text-secondary-text">Cinematic Crimson (#E52525) capturing dramatic intensity and passion.</p>
          </div>

          <div className="p-6 rounded-2xl bg-card border border-white/5 space-y-3">
            <div className="w-8 h-8 rounded-lg bg-[#08090D] border border-white/20" />
            <h3 className="font-semibold text-white">Deep Obsidian</h3>
            <p className="text-xs text-secondary-text">Midnight Dark Background (#08090D) providing premium theater immersion.</p>
          </div>
        </div>
      </section>

      {/* Call to action */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-primary/5 border border-primary/20 space-y-6">
          <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white">
            Ready to Explore the World of Cinema?
          </h2>
          <p className="text-sm text-secondary-text max-w-md mx-auto">
            Discover 100+ curated titles across industries and languages, check reviews, and dive into your next favorite story.
          </p>
          <div>
            <Link
              to="/movies"
              className="inline-flex items-center space-x-2 px-7 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition shadow-lg"
            >
              <span>Browse All Movies</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
