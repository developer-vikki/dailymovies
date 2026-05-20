import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
  Star,
  PlayCircle,
  CalendarDays,
  Clock3,
  ArrowLeft,
  MonitorPlay,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
    category: string;
    slug: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const supabase = await createClient();

  const { data: movie } = await supabase
    .from("movies")
    .select(
      `
      *,
      categories!movies_category_id_fkey (
        name,
        slug
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (!movie) {
    return {
      title: "Movie Not Found | DailyMovies",
    };
  }

  const title = `${movie.title} (${new Date(
    movie.release_date,
  ).getFullYear()}) Download HD`;

  const description =
    movie.description ||
    `${movie.title} full movie download in ${movie.quality} quality. Watch and download latest movies online.`;

  const image = movie.poster_url || "/placeholder.png";

  return {
    title,
    description,
    keywords: [
      movie.title,
      `${movie.title} download`,
      `${movie.title} full movie`,
      `${movie.title} watch online`,
      `${movie.quality} movies`,
      movie.categories?.name,
    ],

    openGraph: {
      title,
      description,
      url: `https://dailymovies.watch/media/${movie.categories?.slug}/${movie.slug}`,
      siteName: "DailyMovies",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: movie.title,
        },
      ],
      locale: "en_US",
      type: "video.movie",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },

    alternates: {
      canonical: `https://dailymovies.watch/media/${movie.categories?.slug}/${movie.slug}`,
    },
  };
}

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

  // console.log("MOVIE ID:", movie.id);
  // console.log("DOWNLOADS:", downloads);

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

  // SEO Metadata

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* HERO */}
      <section className="relative min-h-[95vh] overflow-hidden">
        {/* BACKDROP */}
        <Image
          src={movie.poster_url || "/placeholder.png"}
          alt={movie.title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 400px"
          className="object-cover"
        />

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-linear-to-t from-[#050816] via-[#050816]/90 to-black/30" />

        {/* GLOW */}
        <div className="absolute left-1/2 top-0 h-125 w-125 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

        {/* CONTENT */}
        <div className="relative z-10 container mx-auto px-4 py-8 lg:py-14">
          {/* BACK BUTTON */}
          <Link
            href="/"
            className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-cyan-400"
          >
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          {/* MAIN CARD */}
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-2xl">
            {/* TOP AREA */}
            <div className="grid gap-6 p-5 lg:grid-cols-[280px_1fr]">
              {/* POSTER */}
              <div className="relative aspect-2/3 overflow-hidden rounded-2xl border border-white/10">
                <Image
                  src={movie.poster_url || "/placeholder.png"}
                  alt={movie.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>

              {/* INFO */}
              <div className="flex flex-col justify-between">
                <div>
                  {/* CATEGORY */}
                  <div className="mb-3 inline-flex rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-300">
                    {movie.categories?.name || "Movie"}
                  </div>

                  {/* TITLE */}
                  <h1 className="text-3xl font-black leading-tight md:text-5xl">
                    {movie.title}
                  </h1>

                  {/* META */}
                  <div className="mt-5 flex flex-wrap gap-3">
                    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                      <Star
                        size={15}
                        className="fill-yellow-400 text-yellow-400"
                      />
                      {movie.imdb_rating || "8.5"}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                      <CalendarDays size={15} />
                      {movie.release_date
                        ? new Date(movie.release_date).getFullYear()
                        : "2025"}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                      <Clock3 size={15} />
                      {movie.duration || "2h 10m"}
                    </div>

                    <div className="flex items-center gap-2 rounded-xl bg-white/5 px-3 py-2 text-sm">
                      <MonitorPlay size={15} />
                      {movie.quality || "HD"}
                    </div>
                  </div>

                  {/* DESCRIPTION */}
                  <p className="mt-6 max-w-3xl text-sm leading-7 text-zinc-300 md:text-base">
                    {movie.description || "No description available."}
                  </p>
                </div>

                {/* WATCH BUTTON */}
                {movie.video_url && (
                  <div className="mt-6">
                    <a
                      href={movie.video_url}
                      target="_blank"
                      className="inline-flex items-center gap-2 rounded-2xl bg-cyan-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
                    >
                      <PlayCircle size={18} />
                      Watch Now
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* SCREENSHOTS */}
            <div className="border-t border-white/10 p-5">
              <h2 className="mb-4 text-lg font-bold text-white">Screenshots</h2>

              <div className="flex gap-4 overflow-x-auto pb-2">
                {[1, 2, 3, 4].map((item) => (
                  <div
                    key={item}
                    className="relative aspect-video min-w-70 overflow-hidden rounded-2xl border border-white/10"
                  >
                    <Image
                      src={movie.poster_url || "/placeholder.png"}
                      alt={movie.title}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, 400px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* DOWNLOADS */}
            <div className="border-t border-white/10 p-5">
              <h2 className="mb-4 text-lg font-bold text-white">
                Download Links
              </h2>

              <div className="grid gap-3">
                {downloads?.map((download) => (
                  <a
                    key={download.id}
                    href={download.download_url}
                    target="_blank"
                    className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 transition hover:border-cyan-400/40 hover:bg-white/10"
                  >
                    <div>
                      <p className="font-semibold text-white">
                        Download {download.quality || "HD"}
                      </p>

                      <p className="mt-1 text-xs text-zinc-400">
                        {download.file_size_mb
                          ? download.file_size_mb >= 1024
                            ? `${(download.file_size_mb / 1024).toFixed(2)} GB`
                            : `${download.file_size_mb} MB`
                          : "700 MB"}
                      </p>
                    </div>

                    <div className="rounded-xl bg-cyan-500 px-4 py-2 text-sm font-bold text-black">
                      Download
                    </div>
                  </a>
                ))}
              </div>
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
                  src={movie.poster_url || "/placeholder.png"}
                  alt={movie.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
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
