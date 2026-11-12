// src/data/genres.ts
export interface GenreMeta {
  name: string;
  slug: string;
  description: string;
  color: string;
}

export const genres: string[] = [
  "Drama",
  "Comedy",
  "Action",
  "Thriller",
  "Romance",
  "Sci-Fi",
  "Crime",
  "Adventure",
  "Family",
  "Historical",
  "Horror",
  "Mystery",
];

export const genreDetails: GenreMeta[] = [
  { name: "Drama", slug: "Drama", description: "Emotional, thought-provoking stories rooted in culture, depth, and human relationships.", color: "from-amber-600/20 to-amber-950/10 border-amber-500/30" },
  { name: "Comedy", slug: "Comedy", description: "Heartwarming humor, witty punchlines, and hilarious dynamics.", color: "from-yellow-500/20 to-yellow-950/10 border-yellow-500/30" },
  { name: "Action", slug: "Action", description: "Heroic battles, grand spectacles, and adrenaline-pumping confrontations.", color: "from-orange-600/20 to-orange-950/10 border-orange-500/30" },
  { name: "Thriller", slug: "Thriller", description: "Gripping suspense, high stakes, edge-of-seat twists, and psychological drama.", color: "from-red-600/20 to-red-950/10 border-red-500/30" },
  { name: "Romance", slug: "Romance", description: "Soulful love stories, passion, and touching melodies.", color: "from-pink-600/20 to-rose-950/10 border-pink-500/30" },
  { name: "Sci-Fi", slug: "Sci-Fi", description: "Mind-bending futuristic concepts, space odysseys, and speculative imagination.", color: "from-blue-600/20 to-blue-950/10 border-blue-500/30" },
  { name: "Crime", slug: "Crime", description: "Intense underworld sagas, investigative pursuits, and moral dilemmas.", color: "from-zinc-600/20 to-zinc-950/10 border-zinc-500/30" },
  { name: "Adventure", slug: "Adventure", description: "Scenic road trips, spirited voyages, and life-changing self-discoveries.", color: "from-cyan-600/20 to-cyan-950/10 border-cyan-500/30" },
  { name: "Family", slug: "Family", description: "Wholesome, generational entertainment celebrating togetherness and joy.", color: "from-emerald-600/20 to-emerald-950/10 border-emerald-500/30" },
  { name: "Historical", slug: "Historical", description: "Epic period sagas commemorating folklore, heritage, and pride.", color: "from-amber-700/20 to-amber-950/10 border-amber-600/30" },
  { name: "Horror", slug: "Horror", description: "Ancient folklore, psychological darkness, and occult mysteries.", color: "from-purple-900/30 to-purple-950/10 border-purple-500/30" },
  { name: "Mystery", slug: "Mystery", description: "Intriguing secrets, hidden identities, and clever investigative quests.", color: "from-indigo-900/30 to-indigo-950/10 border-indigo-500/30" },
];
