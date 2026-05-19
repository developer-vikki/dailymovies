import Image from "next/image";
import Link from "next/link";

import {
  Star,
  Download,
  PlayCircle,
  CalendarDays,
  Clock3,
  BadgeInfo,
  ArrowLeft,
  MonitorPlay,
  Languages,
  HardDrive,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export default async function MovieDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  // FETCH MOVIE
  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      categories!movies_category_id_fkey (
        id,
        name,
        slug
      )
    `,
    )
    .eq("slug", slug)
    .single();

  // NOT FOUND
  if (!movie || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
        <h1 className="text-3xl font-black">Movie not found</h1>

        <Link
          href="/"
          className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-black"
        >
          Back Home
        </Link>
      </div>
    );
  }

  // DOWNLOAD LINKS
  const { data: downloads } = await supabase
    .from("downloads")
    .select("*")
    .eq("movie_id", movie.id);

  // RELATED MOVIES
  const { data: relatedMovies } = await supabase
    .from("movies")
    .select(
      `
      *,
      categories!movies_category_id_fkey (
        slug,
        name
      )
    `,
    )
    .eq("category_id", movie.category_id)
    .neq("id", movie.id)
    .limit(6);

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* HERO */}
      <section className="relative min-h-[95vh] overflow-hidden">
        {/* BACKDROP */}
        <Image
          src={movie.backdrop_url || movie.poster_url}
          alt={movie.title}
          fill
          priority
          className="object-cover opacity-25"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-[#050816]/90 to-black/30" />

        {/* GLOW */}
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 container mx-auto px-4 py-8 md:py-16">
          {/* BACK */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:items-end">
            {/* POSTER */}
            <div className="mx-auto w-full max-w-[320px]">
              <div className="relative aspect-2/3 overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-cyan-500/10">
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>

            {/* DETAILS */}
            <div>
              {/* CATEGORY */}
              <div className="mb-4 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300">
                {movie.categories?.name}
              </div>

              {/* TITLE */}
              <h1 className="max-w-4xl text-3xl font-black leading-tight md:text-5xl lg:text-6xl">
                {movie.title}
              </h1>

              {/* META */}
              <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-zinc-300">
                {/* RATING */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Star size={14} className="fill-yellow-400 text-yellow-400" />

                  <span className="font-medium">
                    {movie.imdb_rating || "8.5"}
                  </span>
                </div>

                {/* DATE */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <CalendarDays size={14} />

                  <span>
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                          },
                        )
                      : "2025"}
                  </span>
                </div>

                {/* DURATION */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Clock3 size={14} />

                  <span>{movie.duration || "2h 10m"}</span>
                </div>

                {/* QUALITY */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <MonitorPlay size={14} />

                  <span>{movie.quality || "HD"}</span>
                </div>
              </div>

              {/* DESCRIPTION */}
              <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                {movie.description || "No description available."}
              </p>

              {/* ACTION BUTTONS */}
              <div className="mt-8 flex flex-wrap gap-3">
                {/* WATCH */}
                {movie.video_url && (
                  <a
                    href={movie.video_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-semibold text-black transition hover:bg-cyan-400"
                  >
                    <PlayCircle size={18} />
                    Watch Now
                  </a>
                )}

                {/* DOWNLOADS */}
                {downloads?.map((download) => (
                  <a
                    key={download.id}
                    href={download.download_url}
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white transition hover:border-cyan-400/40 hover:bg-white/10"
                  >
                    <Download size={16} />

                    {download.quality}

                    {download.file_size_mb && (
                      <span className="text-xs text-zinc-400">
                        ({download.file_size_mb}MB)
                      </span>
                    )}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INFO SECTION */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid gap-6 lg:grid-cols-[350px_1fr]">
          {/* INFO CARD */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2 text-cyan-400">
              <BadgeInfo size={18} />

              <h2 className="text-lg font-bold">Movie Information</h2>
            </div>

            <div className="space-y-4">
              {/* LANGUAGE */}
              <div className="flex items-center justify-between rounded-2xl bg-black/30 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <Languages size={16} />

                  <span className="text-sm">Language</span>
                </div>

                <span className="text-sm font-medium">
                  {movie.language || "English"}
                </span>
              </div>

              {/* QUALITY */}
              <div className="flex items-center justify-between rounded-2xl bg-black/30 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <MonitorPlay size={16} />

                  <span className="text-sm">Quality</span>
                </div>

                <span className="text-sm font-medium">
                  {movie.quality || "HD"}
                </span>
              </div>

              {/* STORAGE */}
              <div className="flex items-center justify-between rounded-2xl bg-black/30 p-4">
                <div className="flex items-center gap-2 text-zinc-400">
                  <HardDrive size={16} />

                  <span className="text-sm">Downloads</span>
                </div>

                <span className="text-sm font-medium">
                  {movie.downloads_count || "10K+"}
                </span>
              </div>
            </div>
          </div>

          {/* SCREENSHOTS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            <h2 className="mb-5 text-xl font-bold">Screenshots</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="group relative aspect-video overflow-hidden rounded-2xl"
                >
                  <Image
                    src={movie.backdrop_url || movie.poster_url}
                    alt={movie.title}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl font-black">Related Movies</h2>

          <span className="text-sm text-zinc-500">More like this</span>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {relatedMovies?.map((relatedMovie) => (
            <Link
              key={relatedMovie.id}
              href={`/media/${relatedMovie.categories?.slug}/${relatedMovie.slug}`}
              className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/40"
            >
              <div className="relative aspect-2/3 overflow-hidden">
                <Image
                  src={relatedMovie.poster_url}
                  alt={relatedMovie.title}
                  fill
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-3">
                <h3 className="line-clamp-1 text-sm font-semibold text-white">
                  {relatedMovie.title}
                </h3>

                <p className="mt-1 text-xs text-zinc-400">
                  {relatedMovie.categories?.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
