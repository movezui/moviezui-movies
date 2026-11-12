// src/components/layout/Navbar.tsx
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Search, Menu, X, Film } from "lucide-react";

const navLinks = [
  { name: "Home", to: "/" },
  { name: "All Movies", to: "/movies" },
  { name: "Genres", to: "/genres" },
  { name: "About", to: "/about" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/movies?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-background/90 border-b border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo & Brand */}
          <Link
            to="/"
            className="flex items-center space-x-3 group py-2"
            aria-label="Moviezui Home"
          >
            <div className="relative overflow-hidden rounded-md border border-primary/20 p-0.5 bg-black/40 shadow-sm transition group-hover:border-primary/50">
              <img
                src="/logo.jpg"
                alt="Moviezui Logo"
                className="h-9 w-auto md:h-11 object-contain rounded"
                onError={(e) => {
                  const target = e.currentTarget;
                  target.style.display = "none";
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
              <div className="hidden h-9 w-9 md:h-11 md:w-11 items-center justify-center bg-primary text-background font-bold rounded">
                <Film size={20} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl md:text-2xl font-bold tracking-tight text-white font-heading">
                MOVIE<span className="text-primary">ZUI</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase text-secondary-text -mt-1 hidden sm:block">
                Global Movie Discovery Hub
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-secondary-text hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden md:flex items-center">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 lg:w-64 pl-9 pr-4 py-1.5 text-sm rounded-full bg-card/90 text-white placeholder-secondary-text border border-white/10 focus:outline-none focus:border-primary/70 focus:ring-1 focus:ring-primary/70 transition"
              />
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none"
              />
            </form>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-secondary-text hover:text-white hover:bg-white/5 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-backgroundSecondary/95 px-4 pt-3 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search movies across languages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg bg-card text-white placeholder-secondary-text border border-white/10 focus:outline-none focus:border-primary"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-text pointer-events-none"
            />
          </form>

          <div className="flex flex-col space-y-1 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-base font-medium transition ${
                    isActive
                      ? "text-primary bg-primary/10"
                      : "text-secondary-text hover:text-white hover:bg-white/5"
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
