// src/pages/NotFound.tsx
import { Link } from "react-router-dom";
import { Film, Home, ArrowLeft } from "lucide-react";
import SEO from "../components/common/SEO";

export default function NotFound() {
  return (
    <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
      <SEO
        title="Page Not Found (404)"
        description="The requested page could not be found on Moviezui. Explore our complete catalog of movies across languages and genres."
        noindex={true}
      />
      <div className="w-20 h-20 rounded-full bg-card border border-white/10 flex items-center justify-center mx-auto text-primary">
        <Film size={36} />
      </div>
      <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-secondary/15 text-secondary border border-secondary/30 font-bold">
        Error 404
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold font-heading text-white">
        Scene Not Found
      </h1>
      <p className="text-sm text-secondary-text leading-relaxed">
        The page you are looking for doesn&apos;t exist or has taken a detour off-screen. Let&apos;s get you back to the main feature!
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
        <Link
          to="/"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-primary text-background font-bold text-sm hover:bg-primary/90 transition shadow-lg"
        >
          <Home size={16} />
          <span>Go to Homepage</span>
        </Link>
        <Link
          to="/movies"
          className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-6 py-3 rounded-xl bg-card hover:bg-card/80 text-white font-medium text-sm border border-white/10 transition"
        >
          <ArrowLeft size={16} />
          <span>Browse All Movies</span>
        </Link>
      </div>
    </div>
  );
}
