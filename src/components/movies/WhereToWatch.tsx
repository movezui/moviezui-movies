// src/components/movies/WhereToWatch.tsx
import { ExternalLink, Tv } from "lucide-react";
import type { WatchOption } from "../../types/movie";

interface WhereToWatchProps {
  watchOptions?: WatchOption[];
  movieTitle: string;
}

// Visual badge & branding configs for streaming platforms
function getPlatformConfig(platform: string) {
  const p = platform.toLowerCase();

  if (p.includes("netflix")) {
    return {
      iconBg: "bg-red-500/10 text-red-500 border-red-500/20",
      icon: (
        <span className="font-extrabold text-base tracking-tighter text-red-500 font-sans">
          N
        </span>
      ),
    };
  }

  if (p.includes("prime") || p.includes("amazon")) {
    return {
      iconBg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: (
        <span className="font-black text-xs tracking-wider text-blue-400 uppercase font-sans">
          Prime
        </span>
      ),
    };
  }

  if (p.includes("hotstar") || p.includes("jio")) {
    return {
      iconBg: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-cyan-400" aria-hidden="true">
          <path d="M12 2l2.9 6.2 6.8.8-5 4.7 1.3 6.7-6-3.3-6 3.3 1.3-6.7-5-4.7 6.8-.8z" />
        </svg>
      ),
    };
  }

  if (p.includes("zee5")) {
    return {
      iconBg: "bg-purple-500/10 text-purple-400 border-purple-500/20",
      icon: (
        <span className="font-extrabold text-xs tracking-tight text-purple-400 font-sans">
          ZEE5
        </span>
      ),
    };
  }

  if (p.includes("sony")) {
    return {
      iconBg: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      icon: (
        <span className="font-black text-xs tracking-wider text-amber-400 uppercase font-sans">
          LIV
        </span>
      ),
    };
  }

  if (p.includes("apple")) {
    return {
      iconBg: "bg-zinc-400/10 text-zinc-300 border-zinc-500/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-zinc-200" aria-hidden="true">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.57.65-1.07 1.72-.94 2.74 1.01.08 2.04-.49 2.66-1.24z" />
        </svg>
      ),
    };
  }

  if (p.includes("youtube")) {
    return {
      iconBg: "bg-red-600/10 text-red-500 border-red-600/20",
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5 fill-red-500" aria-hidden="true">
          <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.4 31.4 0 0 0 0 12c0 2 .2 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1c.3-1.9.5-3.8.5-5.8 0-2-.2-3.9-.5-5.8zM9.5 15.5v-7l6.3 3.5-6.3 3.5z" />
        </svg>
      ),
    };
  }

  if (p.includes("shemaroo")) {
    return {
      iconBg: "bg-orange-500/10 text-orange-400 border-orange-500/20",
      icon: (
        <span className="font-extrabold text-xs tracking-tight text-orange-400 font-sans">
          SMe
        </span>
      ),
    };
  }

  if (p.includes("hoichoi")) {
    return {
      iconBg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
      icon: (
        <span className="font-extrabold text-xs tracking-tight text-rose-400 font-sans">
          hoi
        </span>
      ),
    };
  }

  if (p.includes("sun nxt")) {
    return {
      iconBg: "bg-amber-600/10 text-amber-500 border-amber-600/20",
      icon: (
        <span className="font-black text-xs tracking-tight text-amber-500 font-sans">
          SUN
        </span>
      ),
    };
  }

  if (p.includes("manoramamax")) {
    return {
      iconBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      icon: (
        <span className="font-extrabold text-xs tracking-tight text-emerald-400 font-sans">
          MAX
        </span>
      ),
    };
  }

  if (p.includes("aha")) {
    return {
      iconBg: "bg-orange-600/10 text-orange-500 border-orange-600/20",
      icon: (
        <span className="font-extrabold text-xs tracking-tight text-orange-500 font-sans">
          aha
        </span>
      ),
    };
  }

  if (p.includes("vi movies")) {
    return {
      iconBg: "bg-red-700/10 text-red-400 border-red-700/20",
      icon: (
        <span className="font-black text-xs tracking-tight text-red-400 font-sans">
          Vi
        </span>
      ),
    };
  }

  if (p.includes("mubi")) {
    return {
      iconBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
      icon: (
        <span className="font-black text-xs tracking-widest text-indigo-400 font-sans">
          MUBI
        </span>
      ),
    };
  }

  if (p.includes("lionsgate")) {
    return {
      iconBg: "bg-yellow-600/10 text-yellow-500 border-yellow-600/20",
      icon: (
        <span className="font-bold text-[10px] tracking-tight text-yellow-500 font-sans">
          LION
        </span>
      ),
    };
  }

  return {
    iconBg: "bg-primary/10 text-primary border-primary/20",
    icon: <Tv size={20} className="text-primary" />,
  };
}

function getTypeBadge(type: WatchOption["type"]) {
  switch (type) {
    case "subscription":
      return { label: "Subscription", style: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25" };
    case "rent":
      return { label: "Rent", style: "bg-amber-500/10 text-amber-300 border-amber-500/25" };
    case "buy":
      return { label: "Buy", style: "bg-indigo-500/10 text-indigo-300 border-indigo-500/25" };
    case "free":
      return { label: "Free", style: "bg-teal-500/10 text-teal-300 border-teal-500/25" };
    default:
      return { label: "Watch", style: "bg-white/10 text-white/80 border-white/15" };
  }
}

export default function WhereToWatch({ watchOptions, movieTitle }: WhereToWatchProps) {
  const hasOptions = Array.isArray(watchOptions) && watchOptions.length > 0;

  return (
    <div className="space-y-4 pt-2">
      {/* Section Header */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-1.5 h-5 bg-primary rounded-full" />
          <h2 className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
            Where to Watch
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-secondary-text pl-3.5">
          Find where you can stream or rent this movie.
        </p>
      </div>

      {/* Available Platform Cards or Clean Unavailable State */}
      {hasOptions ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4 pl-0 sm:pl-3.5">
          {watchOptions.map((opt, idx) => {
            const platformConfig = getPlatformConfig(opt.platform);
            const typeConfig = getTypeBadge(opt.type);

            return (
              <div
                key={`${opt.platform}-${opt.type}-${idx}`}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-card/80 hover:bg-card border border-white/10 hover:border-primary/40 transition-all duration-200 shadow-md group"
              >
                {/* Platform info on the left: Icon + Full Name + Availability Badge */}
                <div className="flex items-center space-x-3.5 min-w-0 flex-1">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border transition-transform duration-200 group-hover:scale-105 shadow-inner ${platformConfig.iconBg}`}
                  >
                    {platformConfig.icon}
                  </div>
                  <div className="min-w-0 space-y-1 flex-1">
                    <span className="text-sm sm:text-base font-bold text-white leading-snug block whitespace-normal break-words">
                      {opt.platform}
                    </span>
                    <div className="flex items-center">
                      <span
                        className={`inline-flex items-center text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${typeConfig.style}`}
                      >
                        {typeConfig.label}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Watch Now button on right (desktop) or full-width button (mobile) */}
                <a
                  href={opt.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-background font-bold text-xs sm:text-sm shrink-0 min-h-[42px] transition-all duration-200 hover:scale-105 active:scale-95 shadow-md shadow-primary/10 hover:shadow-primary/20 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  aria-label={`Watch ${movieTitle} on ${opt.platform} (${typeConfig.label})`}
                >
                  <span>Watch Now</span>
                  <ExternalLink size={14} className="shrink-0" />
                </a>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="sm:ml-3.5 p-4 sm:p-5 rounded-2xl bg-card/40 border border-white/5 flex items-center space-x-3.5 text-secondary-text shadow-sm">
          <Tv size={20} className="text-secondary-text/60 shrink-0" />
          <span className="text-xs sm:text-sm font-medium">
            No verified streaming options available right now.
          </span>
        </div>
      )}
    </div>
  );
}
