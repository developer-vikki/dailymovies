// components/home/movie-card.tsx

"use client";

import Image from "next/image";
import Link from "next/link";
import { Download, Star } from "lucide-react";

// 1. Strict Typing to match your Supabase Database
type Movie = {
  id: string;
  title: string;
  slug: string;
  poster_url: string | null;
  imdb_rating: number | null;
  created_at: string;
  quality?: string; // Made optional since it's not in the main movies table
  downloads?: string;
};

export default function MovieCard({ movie }: { movie: Movie }) {
  // 2. Format the raw database timestamp into a clean UI string (e.g., "May 18, 2026")
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(movie.created_at));

  return (
    <Link
      href={`/movie/${movie.slug}`}
      className="
        group relative overflow-hidden
        rounded-[22px]
        border border-white/10
        bg-white/3
        transition-all duration-300
        hover:-translate-y-1
        hover:border-cyan-400/30
      "
    >
      {/* Poster */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <Image
          src={movie.poster_url || "/placeholder.png"}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw" // Best practice for Next.js Image performance
          className="
            object-cover
            transition-transform duration-500
            group-hover:scale-110
          "
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

        {/* Rating */}
        {movie.imdb_rating && (
          <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full border border-yellow-400/20 bg-black/50 px-2 py-1 backdrop-blur-xl">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-[10px] font-semibold text-white">
              {movie.imdb_rating.toFixed(1)}
            </span>
          </div>
        )}

        {/* Download Button Icon */}
        <button
          className="
            absolute right-2 top-2
            flex h-8 w-8 items-center justify-center
            rounded-full
            border border-white/10
            bg-black/50
            text-white
            backdrop-blur-xl
            transition-colors
            hover:bg-cyan-500/50
          "
        >
          <Download className="h-3.5 w-3.5" />
        </button>

        {/* Content */}
        <div className="absolute bottom-0 left-0 w-full p-3">
          <p className="mb-1 text-[10px] font-medium text-cyan-300">
            {formattedDate}
          </p>

          <h3 className="line-clamp-2 text-sm font-bold leading-5 text-white">
            {movie.title}
          </h3>

          {/* Only render quality if it exists */}
          {movie.quality && (
            <p className="mt-1 text-[11px] text-white/65">{movie.quality}</p>
          )}

          {/* Added the downloads stat we pulled from your new SQL table */}
          {movie.downloads && (
            <p className="mt-1 text-[11px] font-semibold text-cyan-400">
              {movie.downloads} Downloads
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
