"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Clapperboard, Download, Play, Star } from "lucide-react";

type Category = {
  slug: string;
  name: string;
};

type Movie = {
  id: string;
  title: string;
  slug: string;
  poster_url: string | null;
  imdb_rating: number | null;
  release_date: string | null;

  categories?: Category | null;
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

  const fetchIdRef = useRef(0);

  // ---------------------------------------------------------
  // FETCH MOVIES
  // ---------------------------------------------------------
  const fetchMovies = useCallback(
    async (currentPage: number, isReset: boolean = false) => {
      const currentFetchId = ++fetchIdRef.current;
      setLoading(true);

      const from = currentPage * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      const supabase = createClient();

      // 1. DYNAMIC QUERY STRUCTURE
      // We must use !inner joins ONLY when we are actively filtering by category.
      // Otherwise, movies with 0 categories would be excluded from the general feed.
      const selectQuery = category
        ? `
            id, title, slug, poster_url, imdb_rating, release_date,
            movie_categories!inner (
              categories!inner (
                slug,
                name
              )
            )
          `
        : `
            id, title, slug, poster_url, imdb_rating, release_date,
            movie_categories (
              categories (
                slug,
                name
              )
            )
          `;

      let query = supabase.from("movies").select(selectQuery);

      // 2. APPLY FILTERS
      if (category) {
        query = query.eq("movie_categories.categories.slug", category);
      }

      if (search?.trim()) {
        query = query.ilike("title", `%${search.trim()}%`);
      }

      // 3. FETCH & PAGINATE
      const { data, error } = await query
        .order("created_at", { ascending: false })
        .range(from, to);

      if (currentFetchId !== fetchIdRef.current) return;

      if (error) {
        console.error("Supabase error:", error);
        setMovies([]);
        setLoading(false);
        return;
      }

      // 4. TRANSFORM DATA
      const transformed: Movie[] = (data || []).map((movie: any) => {
        // Flatten the junction table array into a clean array of Category objects
        const extractedCategories = (movie.movie_categories || [])
          .map((mc: any) => mc.categories)
          .filter(Boolean); // Remove any nulls

        // Sort alphabetically to guarantee a stable first category selection
        extractedCategories.sort((a: Category, b: Category) =>
          a.name.localeCompare(b.name),
        );

        return {
          id: movie.id,
          title: movie.title,
          slug: movie.slug,
          poster_url: movie.poster_url,
          imdb_rating: movie.imdb_rating,
          release_date: movie.release_date,
          // Safely grab the first alphabetically sorted category
          categories:
            extractedCategories.length > 0 ? extractedCategories[0] : null,
        };
      });

      setHasMore(transformed.length === PAGE_SIZE);

      setMovies((prev) => {
        if (isReset) return transformed;
        const existingIds = new Set(prev.map((m) => m.id));
        const uniqueMovies = transformed.filter((m) => !existingIds.has(m.id));
        return [...prev, ...uniqueMovies];
      });

      setLoading(false);
    },
    [category, search],
  );

  // ---------------------------------------------------------
  // RESET FETCH
  // ---------------------------------------------------------
  useEffect(() => {
    setPage(0);
    setHasMore(true);

    fetchMovies(0, true);
  }, [category, search, fetchMovies]);

  // ---------------------------------------------------------
  // NEXT PAGE FETCH
  // ---------------------------------------------------------
  useEffect(() => {
    if (page === 0) return;

    fetchMovies(page);
  }, [page, fetchMovies]);

  // ---------------------------------------------------------
  // INFINITE SCROLL
  // ---------------------------------------------------------
  const observer = useRef<IntersectionObserver | null>(null);

  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => {
    loadingRef.current = loading;
    hasMoreRef.current = hasMore;
  }, [loading, hasMore]);

  const lastMovieRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) {
      observer.current.disconnect();
    }

    observer.current = new IntersectionObserver((entries) => {
      if (
        entries[0].isIntersecting &&
        hasMoreRef.current &&
        !loadingRef.current
      ) {
        setPage((prev) => prev + 1);
      }
    });

    if (node) {
      observer.current.observe(node);
    }
  }, []);

  // ---------------------------------------------------------
  // MOVIE CARD
  // ---------------------------------------------------------
  const renderMovieCard = (movie: Movie) => (
    <Link
      href={`/media/${movie.categories?.slug || "unknown"}/${movie.slug}`}
      className="group relative block overflow-hidden rounded-xl border border-white/10 bg-[#0b1120]/80 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1.5 hover:border-cyan-400/40 hover:shadow-[0_0_20px_rgba(34,211,238,0.15)]"
    >
      <div className="relative aspect-2/3 overflow-hidden">
        <Image
          src={movie.poster_url || "/placeholder.png"}
          alt={movie.title}
          loading="lazy"
          placeholder="blur"
          blurDataURL="data:image/svg+xml;base64,..."
          width={200}
          height={300}
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

              <span className="font-semibold">{movie.imdb_rating || "NR"}</span>
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
