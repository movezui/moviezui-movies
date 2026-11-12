// src/components/layout/Footer.tsx
import { Link } from "react-router-dom";
import { Film, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-backgroundSecondary border-t border-white/10 text-secondary-text mt-16 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative overflow-hidden rounded-md border border-primary/20 p-0.5 bg-black/40">
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
            <div className="flex items-center space-x-3 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-primary/20 hover:text-primary flex items-center justify-center transition border border-white/5 text-secondary-text"
                aria-label="Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-primary/20 hover:text-primary flex items-center justify-center transition border border-white/5 text-secondary-text"
                aria-label="X (Twitter)"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-primary/20 hover:text-primary flex items-center justify-center transition border border-white/5 text-secondary-text"
                aria-label="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.6 5H18V0h-3.808C10.595 0 9 1.583 9 4.615V8z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-card hover:bg-primary/20 hover:text-primary flex items-center justify-center transition border border-white/5 text-secondary-text"
                aria-label="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
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
            </ul>
          </div>

          {/* Popular Genres */}
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

          {/* Discover Cinema Card */}
          <div className="bg-card/60 p-5 rounded-xl border border-white/5 flex flex-col justify-between">
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
              <span>100+ Curated Titles</span>
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
