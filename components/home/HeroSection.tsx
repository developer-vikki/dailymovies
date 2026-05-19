"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { DownloadIcon, Flame, Play, Sparkles, Star } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Movie = {
  created_at: string;
  id: string;
  title: string;
  slug: string;
  description: string | null;
  release_date: string | null;
  imdb_rating: number | null;
  poster_url: string | null;
  category_id: string | null;
  downloads?: string;
  categories?: {
    slug: string;
    name: string;
  } | null;
};

const formatCompactNumber = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};

export default function Top10HeroFeed() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopDownloadedMovies();
  }, []);

  async function fetchTopDownloadedMovies() {
    setLoading(true);

    const { data, error } = await createClient()
      .from("movie_stats")
      .select(
        `
        download_count,
        movies (
          *,
         categories!movies_category_id_fkey ( slug, name ) )`,
      )
      .order("download_count", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching top movies:", error.message);
      setMovies([]);
      setLoading(false);
      return;
    }

    if (!data || data.length === 0) {
      setMovies([]);
      setLoading(false);
      return;
    }

    const transformed: Movie[] = data.map((stat: any) => ({
      ...stat.movies,
      downloads: formatCompactNumber(stat.download_count),
    }));

    setMovies(transformed);
    setLoading(false);
  }

  return (
    <section className="relative overflow-hidden px-4 py-8 md:px-8 lg:px-10">
      {/* Background Glow */}
      <div className="absolute left-1/2 top-0 h-100 w-100 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Header */}
      <div className="relative z-10 mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold text-cyan-300 backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" />
            TRENDING NOW
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-cyan-500/15 p-2">
              <Flame className="h-6 w-6 text-cyan-300" />
            </div>

            <div>
              <h2 className="text-1xl font-black tracking-tight text-white md:text-2xl">
                Top 10 Weekend Downloads
              </h2>

              <p className="mt-1 text-sm text-white/50">
                Most downloaded movies updated in real-time
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Grid */}
      <div className="relative z-10 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7">
        {loading
          ? Array.from({ length: 7 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="animate-pulse overflow-hidden rounded-1xl border border-white/5 bg-white/3"
              >
                <div className="aspect-2/3 w-full bg-white/5" />

                <div className="space-y-3 p-4">
                  <div className="h-4 w-3/4 rounded bg-white/5" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              </div>
            ))
          : movies.map((movie, index) => {
              const href = `media/${
                movie.categories?.slug || "media"
              }/${movie.slug}`;

              return (
                <Link
                  href={href}
                  key={movie.id}
                  className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#0b1120]/80 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
                >
                  {/* Poster */}
                  <div className="relative aspect-2/3 overflow-hidden">
                    {movie.poster_url ? (
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-black text-sm text-white/40">
                        No Poster
                      </div>
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/50 to-transparent opacity-90" />

                    {/* Hover Play */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-md">
                        <Play className="ml-0.5 h-4 w-4 fill-white text-white" />
                      </div>
                    </div>

                    {/* Rank */}
                    <div className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-cyan-500 text-[10px] font-black text-white shadow-lg shadow-cyan-500/40">
                      #{index + 1}
                    </div>

                    {/* Category */}
                    {movie.categories?.name && (
                      <div className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/40 px-2 py-0.5 text-[8px] font-semibold uppercase tracking-wide text-white/80 backdrop-blur-md">
                        {movie.categories.name}
                      </div>
                    )}

                    {/* Bottom Content */}
                    <div className="absolute inset-x-0 bottom-0 p-3">
                      <h3
                        title={movie.title}
                        className="line-clamp-1 text-sm font-bold text-white transition-colors duration-300 group-hover:text-cyan-300"
                      >
                        {movie.title}
                      </h3>

                      <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
                        <span>
                          {movie.release_date
                            ? new Date(movie.release_date).getFullYear()
                            : "2026"}
                        </span>

                        <span className="h-1 w-1 rounded-full bg-white/30" />

                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="font-semibold">
                            {movie.imdb_rating
                              ? movie.imdb_rating.toFixed(1)
                              : "NR"}
                          </span>
                        </div>
                      </div>

                      {/* Downloads */}
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-300">
                          <DownloadIcon className="h-3 w-3" />
                          {movie.downloads}
                        </div>

                        <span className="translate-y-2 text-[10px] font-medium text-white/0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-white/70">
                          →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

        {!loading && movies.length === 0 && (
          <div className="col-span-full rounded-2xl border border-white/10 bg-white/3 p-10 text-center backdrop-blur-xl">
            <p className="text-sm text-white/50">
              No trending movies available right now.
            </p>
          </div>
        )}
      </div>

      {/* Modern Dots */}
      {!loading && movies.length > 0 && (
        <div className="mt-8 flex justify-center">
          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 backdrop-blur-xl">
            {movies.map((_, index) => (
              <div
                key={`dot-${index}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === 0 ? "w-6 bg-cyan-400" : "w-2 bg-white/20"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
