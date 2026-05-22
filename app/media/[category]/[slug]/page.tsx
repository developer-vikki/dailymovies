import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import {
  Star,
  PlayCircle,
  CalendarDays,
  Clock3,
  ArrowLeft,
  Download,
  MonitorPlay,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";

type PageProps = {
  params: Promise<{
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
      movie_categories (
        categories (
          id,
          name,
          slug
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (!movie) {
    return {
      title: "Movie Not Found",
    };
  }

  return {
    title: `${movie.title} Watch & Download HD`,
    description: movie.description,
    alternates: {
      canonical: `https://dailymovies.watch/media/${movie.slug}`,
    },
    openGraph: {
      title: movie.title,
      description: movie.description,
      images: [movie.poster_url],
      type: "video.movie",
    },
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  const supabase = await createClient();

  // MOVIE
  const { data: movie, error } = await supabase
    .from("movies")
    .select(
      `
      *,
      movie_categories (
        categories (
          id,
          name,
          slug
        )
      )
    `,
    )
    .eq("slug", slug)
    .single();

  if (!movie || error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Movie not found
      </div>
    );
  }

  // DOWNLOADS
  const { data: downloads } = await supabase
    .from("movie_download_links")
    .select("*")
    .eq("movie_id", movie.id)
    .order("display_order", {
      ascending: true,
    });

  // SCREENSHOTS
  const { data: screenshots } = await supabase
    .from("movie_screenshots")
    .select("*")
    .eq("movie_id", movie.id);

  // RELATED MOVIES
  const categoryIds =
    movie.movie_categories?.map((x: any) => x.categories?.id) || [];

  const { data: relatedRelations } = await supabase
    .from("movie_categories")
    .select(
      `
      movies (
        *,
        movie_categories (
          categories (
            id,
            name,
            slug
          )
        )
      )
    `,
    )
    .in("category_id", categoryIds)
    .neq("movie_id", movie.id)
    .limit(12);

  const relatedMovies =
    relatedRelations
      ?.map((x: any) => x.movies)
      ?.filter(Boolean)
      ?.slice(0, 6) || [];

  // PLAYER URL
  let trailerUrl = movie.trailer_url || "";

  // YOUTUBE
  if (trailerUrl.includes("youtube.com/watch?v=")) {
    const id = trailerUrl.split("v=")[1]?.split("&")[0];

    trailerUrl = `https://www.youtube.com/embed/${id}`;
  }

  // YOUTU.BE
  if (trailerUrl.includes("youtu.be/")) {
    const id = trailerUrl.split("youtu.be/")[1];

    trailerUrl = `https://www.youtube.com/embed/${id}`;
  }

  // GOOGLE DRIVE
  if (
    trailerUrl.includes("drive.google.com") &&
    trailerUrl.includes("/file/d/")
  ) {
    const id = trailerUrl.split("/file/d/")[1]?.split("/")[0];

    trailerUrl = `https://drive.google.com/file/d/${id}/preview`;
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <section className="container mx-auto px-4 py-8 lg:py-12">
        {/* BACK */}
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-cyan-400"
        >
          <ArrowLeft size={16} />
          Back
        </Link>

        {/* TOP SECTION */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* POSTER */}
          <div className="relative aspect-2/3 overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={movie.poster_url || "/placeholder.png"}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* DETAILS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
            {/* CATEGORIES */}
            <div className="mb-4 flex flex-wrap gap-2">
              {movie.movie_categories?.map((item: any) => (
                <span
                  key={item.categories?.id}
                  className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-300"
                >
                  {item.categories?.name}
                </span>
              ))}
            </div>

            {/* TITLE */}
            <h1 className="text-3xl font-black md:text-5xl">{movie.title}</h1>

            {/* META */}
            <div className="mt-6 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm">
                <Star size={15} className="fill-yellow-400 text-yellow-400" />
                {movie.imdb_rating || "8.5"}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm">
                <CalendarDays size={15} />

                {movie.release_date
                  ? new Date(movie.release_date).getFullYear()
                  : "2025"}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm">
                <Clock3 size={15} />

                {movie.duration_minutes
                  ? `${movie.duration_minutes} min`
                  : "N/A"}
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm">
                <MonitorPlay size={15} />
                HD
              </div>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-6 leading-8 text-zinc-300">{movie.description}</p>

            {/* OTHER DETAILS */}
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase text-zinc-500">Language</p>

                <p className="mt-2 font-semibold">
                  {movie.language || "English"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase text-zinc-500">Release Date</p>

                <p className="mt-2 font-semibold">
                  {movie.release_date || "2025-01-01"}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase text-zinc-500">Country</p>

                <p className="mt-2 font-semibold">{movie.country || "India"}</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
                <p className="text-xs uppercase text-zinc-500">Status</p>

                <p className="mt-2 font-semibold text-green-400">Available</p>
              </div>
            </div>
          </div>
        </div>

        {/* SCREENSHOTS */}
        {screenshots && screenshots.length > 0 && (
          <div className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <h2 className="mb-5 text-2xl font-black">Screenshots</h2>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {screenshots.map((shot: any) => (
                <div
                  key={shot.id}
                  className="relative aspect-video overflow-hidden rounded-2xl border border-white/10"
                >
                  <Image
                    src={shot.image_url}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIDEO + DOWNLOAD */}
        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {/* TRAILER */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2">
              <PlayCircle size={24} className="text-cyan-400" />

              <h2 className="text-2xl font-black">Video Preview</h2>
            </div>

            {trailerUrl ? (
              <div className="overflow-hidden rounded-2xl border border-white/10">
                <iframe
                  src={trailerUrl}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="flex aspect-video items-center justify-center rounded-2xl border border-dashed border-white/10 text-zinc-500">
                Trailer Not Available
              </div>
            )}
          </div>

          {/* DOWNLOAD LINKS */}
          {/* DOWNLOAD LINKS */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
            <div className="mb-5 flex items-center gap-2">
              <Download size={24} className="text-cyan-400" />

              <h2 className="text-2xl font-black">Download Links</h2>
            </div>

            <div className="space-y-4">
              {downloads?.length ? (
                downloads.map((download: any) => (
                  <div
                    key={download.id}
                    className="rounded-2xl border border-white/10 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        {/* QUALITY */}
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-cyan-500 px-2 py-1 text-xs font-bold text-black">
                            {download.quality}
                          </span>

                          {download.is_stream && (
                            <span className="rounded-lg bg-green-500 px-2 py-1 text-xs font-bold text-black">
                              STREAM
                            </span>
                          )}
                        </div>

                        {/* SERVER */}
                        <p className="mt-3 text-sm text-zinc-400">
                          Server:{" "}
                          <span className="font-medium text-white">
                            {download.server_name}
                          </span>
                        </p>

                        {/* FILE SIZE */}
                        {download.file_size && (
                          <p className="mt-1 text-sm text-zinc-400">
                            Size:{" "}
                            <span className="text-white">
                              {download.file_size}
                            </span>
                          </p>
                        )}
                      </div>

                      {/* BUTTON */}
                      <a
                        href={download.download_url}
                        target="_blank"
                        className={`rounded-xl px-5 py-3 text-sm font-bold transition ${
                          download.is_stream
                            ? "bg-green-500 text-black hover:bg-green-400"
                            : "bg-cyan-500 text-black hover:bg-cyan-400"
                        }`}
                      >
                        {download.is_stream ? "Watch Now" : "Download"}
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-white/10 p-6 text-center text-zinc-500">
                  No Download Links
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RELATED */}
        {relatedMovies.length > 0 && (
          <div className="mt-14">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-black">Related Movies</h2>

              <span className="text-zinc-500">More like this</span>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {relatedMovies.map((relatedMovie: any) => (
                <Link
                  key={relatedMovie.id}
                  href={`/media/${relatedMovie.slug}`}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition hover:-translate-y-1 hover:border-cyan-400/40"
                >
                  <div className="relative aspect-[2/3] overflow-hidden">
                    <Image
                      src={relatedMovie.poster_url || "/placeholder.png"}
                      alt={relatedMovie.title}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="p-3">
                    <h3 className="line-clamp-1 text-sm font-semibold">
                      {relatedMovie.title}
                    </h3>

                    <p className="mt-1 line-clamp-1 text-xs text-zinc-400">
                      {relatedMovie.movie_categories
                        ?.map((x: any) => x.categories?.name)
                        .join(", ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
