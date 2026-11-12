// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { Film, Heart, ExternalLink } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-backgroundSecondary border-t border-white/10 text-secondary-text mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 xl:gap-8">
          
          {/* 1. Brand Info */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3 group" aria-label="Moviezui Home">
              <div className="relative overflow-hidden rounded-md border border-primary/20 p-0.5 bg-black/40 transition group-hover:border-primary/50">
                <img
                  src="/logo.jpg"
                  alt="Moviezui Logo"
                  className="h-10 w-auto object-contain rounded"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white font-heading">
                MOVIE<span className="text-primary">ZUI</span>
              </span>
            </Link>
            <p className="text-sm text-secondary-text leading-relaxed">
              Your premier discovery platform dedicated to celebrating extraordinary cinema. Explore timeless classics, blockbuster hits, and award-winning stories from around the world.
            </p>
          </div>

          {/* 2. Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white font-heading mb-4 border-l-2 border-primary pl-2">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-primary transition flex items-center space-x-1.5">
                  <span>Home</span>
                </Link>
              </li>
              <li>
                <Link to="/movies" className="hover:text-primary transition flex items-center space-x-1.5">
                  <span>All Movies</span>
                </Link>
              </li>
              <li>
                <Link to="/genres" className="hover:text-primary transition flex items-center space-x-1.5">
                  <span>Browse by Genres</span>
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-primary transition flex items-center space-x-1.5">
                  <span>About Moviezui</span>
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-primary transition flex items-center space-x-1.5">
                  <span>Contact Us</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. Popular Genres */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white font-heading mb-4 border-l-2 border-primary pl-2">
              Popular Genres
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/movies?genre=Drama" className="hover:text-primary transition">
                  Drama
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Comedy" className="hover:text-primary transition">
                  Comedy
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Action" className="hover:text-primary transition">
                  Action & Adventure
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Thriller" className="hover:text-primary transition">
                  Thriller & Mystery
                </Link>
              </li>
              <li>
                <Link to="/movies?genre=Sci-Fi" className="hover:text-primary transition">
                  Sci-Fi & Fantasy
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. Dedicated Legal Section */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-white font-heading mb-4 border-l-2 border-primary pl-2">
              Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/privacy-policy" className="hover:text-primary transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-primary transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="hover:text-primary transition">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/cookie-policy" className="hover:text-primary transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/copyright-policy" className="hover:text-primary transition">
                  Copyright Policy
                </Link>
              </li>
              <li>
                <a
                  href="/sitemap.xml"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition inline-flex items-center space-x-1 text-secondary-text/90"
                >
                  <span>Sitemap</span>
                  <ExternalLink size={12} className="shrink-0 text-primary/70" />
                </a>
              </li>
            </ul>
          </div>

          {/* 5. World Cinema Card */}
          <div className="sm:col-span-2 md:col-span-1 lg:col-span-1 bg-card/60 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-2 text-primary mb-2">
                <Film size={20} />
                <span className="font-semibold text-sm uppercase tracking-wider">World Cinema</span>
              </div>
              <p className="text-xs text-secondary-text leading-relaxed">
                Celebrating compelling storytelling with stories that touch hearts across languages and cultures.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-secondary-text">
              <span>228+ Curated Titles</span>
              <span className="text-primary font-medium">Global Cinema</span>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-secondary-text gap-4">
          <p>© {currentYear} MOVIEZUI. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Crafted with pride for movie lovers worldwide</span>
            <Heart size={14} className="text-secondary fill-secondary" />
          </p>
        </div>
      </div>
    </footer>
  );
}
