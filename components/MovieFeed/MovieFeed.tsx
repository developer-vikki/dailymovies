// components/home/movie-feed.tsx

"use client";

import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

import MovieCard from "./MovieCard";
import SkeletonCard from "./SkeletonCard";
import InfiniteScrollTrigger from "./InfiniteScrollTrigger";

// 1. Enforce the strict Movie type
type Movie = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  release_date: string | null;
  duration_minutes: number | null;
  imdb_rating: number | null;
  poster_url: string | null;
  preview_video_url: string | null;
  created_at: string;
  category_id: string | null;
};

const LIMIT = 12;

export default function MovieFeed() {
  // 2. Apply the type to your state
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false); // Start false to prevent initial block
  const [hasMore, setHasMore] = useState(true);

  // 3. Use a ref to prevent race conditions when infinite scrolling triggers rapidly
  const isFetching = useRef(false);

  // Initial Load
  useEffect(() => {
    fetchMovies(true);
  }, []);

  async function fetchMovies(reset = false) {
    // Prevent overlapping fetch calls
    if (isFetching.current || (!reset && !hasMore)) return;

    isFetching.current = true;
    setLoading(true);

    const currentPage = reset ? 0 : page;
    const from = currentPage * LIMIT;
    const to = from + LIMIT - 1;

    const { data, error } = await createClient()
      .from("movies")
      .select("*")
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) {
      console.error("Error fetching latest movies:", error.message);
      setLoading(false);
      isFetching.current = false;
      return;
    }

    if (!data || data.length === 0) {
      setHasMore(false);
      setLoading(false);
      isFetching.current = false;
      return;
    }

    if (reset) {
      setMovies(data);
      setPage(1);
    } else {
      setMovies((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    }

    // If we received fewer movies than the limit, we've hit the end of the database
    if (data.length < LIMIT) {
      setHasMore(false);
    }

    setLoading(false);
    isFetching.current = false;
  }

  return (
    <section className="p-5 md:p-8 lg:p-10">
      {/* Heading */}
      <div className="mb-7 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Latest Movies</h2>
          <p className="mt-1 text-sm text-white/45">
            Freshly updated streaming collection
          </p>
        </div>

        <button
          className="
            rounded-2xl
            border border-white/10
            bg-white/[0.05]
            px-4 py-2
            text-sm font-medium text-white
            transition hover:bg-white/[0.08]
          "
        >
          View All
        </button>
      </div>

      {/* Feed */}
      <div
        className="
          grid gap-4
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6
        "
      >
        {movies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}

        {/* Skeleton Loading */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Empty State */}
      {!loading && movies.length === 0 && (
        <div className="py-10 text-center text-white/50">
          No movies have been added yet.
        </div>
      )}

      {/* Infinite Scroll */}
      {hasMore && movies.length > 0 && (
        <InfiniteScrollTrigger
          onVisible={() => fetchMovies()}
          hasMore={hasMore}
        />
      )}
    </section>
  );
}
