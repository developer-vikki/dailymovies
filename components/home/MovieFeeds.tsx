"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Clapperboard, Download, Play, Star } from "lucide-react";

type Movie = {
  id: string;
  title: string;
  slug: string;
  poster_url: string;
  imdb_rating: number;
  release_date: string;
  categories: {
    slug: string;
    name: string;
  };
};

const PAGE_SIZE = 12;

export default function MovieFeeds() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const searchParams = useSearchParams();
  const category = searchParams.get("category");
  const search = searchParams.get("search");

  // Prevent Race Conditions during rapid typing/searching
  const fetchIdRef = useRef(0);

  // FETCH MOVIES
  const fetchMovies = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      // Create a unique ID for this specific fetch request
      const currentFetchId = ++fetchIdRef.current;
      setLoading(true);

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const supabase = createClient();

      // 1. Determine join syntax based on category filter
      const joinQuery = category
        ? `categories!movies_category_id_fkey!inner(slug, name)`
        : `categories!movies_category_id_fkey(slug, name)`;

      // 2. Initialize Query
      let queryBuilder = supabase.from("movies").select(`*, ${joinQuery}`);

      // 3. Apply Filters FIRST
      if (category) {
        queryBuilder = queryBuilder.eq("categories.slug", category);
      }

      if (search) {
        const searchTerm = search.trim();
        if (searchTerm !== "") {
          queryBuilder = queryBuilder.ilike("title", `%${searchTerm}%`);
        }
      }

      // 4. Apply Order and Pagination LAST (Crucial for Supabase filters to work)
      const { data, error } = await queryBuilder
        .order("created_at", { ascending: false })
        .range(from, to);

      // 5. Guard against race conditions (discard if a newer fetch started)
      if (currentFetchId !== fetchIdRef.current) {
        return;
      }

      if (error) {
        console.error("Supabase error message:", error.message);
        console.error("Supabase error details:", error.details);
        setLoading(false);
        return;
      }

      const fetchedMovies = data || [];

      // CHECK MORE DATA
      setHasMore(fetchedMovies.length === PAGE_SIZE);

      // UPDATE STATE WITH DEDUPLICATION
      setMovies((prev) => {
        if (isReset) return fetchedMovies;

        const newMovies = [...prev];
        fetchedMovies.forEach((movie) => {
          // Prevent React duplicate key errors during fast appending
          if (!newMovies.some((m) => m.id === movie.id)) {
            newMovies.push(movie);
          }
        });
        return newMovies;
      });

      setLoading(false);
    },
    [category, search],
  );

  // INITIAL FETCH (Triggers when Search or Category changes)
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    fetchMovies(0, true);
  }, [category, search, fetchMovies]);

  // NEXT PAGE FETCH (Triggers on Infinite Scroll)
  useEffect(() => {
    if (page === 0) return;
    fetchMovies(page, false);
  }, [page, fetchMovies]);

  // -----------------------------------------------------------------
  // OPTIMIZED INFINITE SCROLL OBSERVER
  // -----------------------------------------------------------------
  const observer = useRef<IntersectionObserver | null>(null);

  // Keep track of latest state without causing observer re-renders
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const lastMovieRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreRef.current &&
        !loadingRef.current
      ) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, []); // Empty dependency array prevents glitchy re-attachments

  // MOVIE CARD
  const renderMovieCard = (movie: Movie) => (
    <Link
      href={`/media/${movie.categories?.slug || "unknown"}/${movie.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#0b1120]/80 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
    >
      {/* Poster */}
      <div className="relative aspect-2/3 overflow-hidden">
        <Image
          src={movie.poster_url || "/media/movie-placeholder.png"}
          alt={movie.title}
          fill
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

        {/* Category */}
        <div className="absolute right-2 top-2 rounded-full border border-white/10 bg-black/40 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-white/80 backdrop-blur-md">
          {movie.categories?.name || "Unknown"}
        </div>

        {/* Play */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-white/10 backdrop-blur-xl">
            <Play className="ml-1 h-5 w-5 fill-white text-white" />
          </div>
        </div>

        {/* Bottom */}
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="line-clamp-1 text-sm font-bold text-white transition-colors duration-300 group-hover:text-cyan-300">
            {movie.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-xs text-white/60">
            <span>
              {movie.release_date
                ? new Date(movie.release_date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                  })
                : "Coming Soon"}
            </span>

            <span className="h-1 w-1 rounded-full bg-white/30" />

            <div className="flex items-center gap-1 text-yellow-400">
              <Star className="h-3 w-3 fill-current" />
              <span className="font-semibold">{movie.imdb_rating}</span>
            </div>
          </div>

          {/* Downloads */}
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-1 rounded-full bg-cyan-500/10 px-2 py-1 text-[10px] font-semibold text-cyan-300">
              <Download className="h-3 w-3" />
              Downloads
            </div>

            <span className="translate-y-2 text-xs text-white/0 transition-all duration-300 group-hover:translate-y-0 group-hover:text-white/70">
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <section className="mt-5 p-8">
      {/* Heading */}
      <h2 className="flex items-center gap-2 text-2xl font-bold text-white">
        <Clapperboard className="h-7 w-7 text-cyan-400" />
        {search ? `Results for "${search}"` : "Movies For You"}
      </h2>

      {/* Feed */}
      <div className="relative z-10 mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie, index) => {
          // Attach ref to the LAST CARD
          if (movies.length === index + 1) {
            return (
              <div ref={lastMovieRef} key={movie.id}>
                {renderMovieCard(movie)}
              </div>
            );
          }

          // NORMAL CARD
          return <div key={movie.id}>{renderMovieCard(movie)}</div>;
        })}
      </div>

      {/* States (Loading / Empty / Finished) */}
      {loading && (
        <div className="mt-8 text-center text-white/50">Loading movies...</div>
      )}

      {!loading && movies.length === 0 && (
        <div className="mt-8 text-center text-white/50">
          No movies found. Try another search.
        </div>
      )}

      {!hasMore && !loading && movies.length > 0 && (
        <div className="mt-8 text-center text-white/30">No more movies</div>
      )}
    </section>
  );
}
