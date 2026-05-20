// app/not-found.tsx

import Link from "next/link";
import { Ghost } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#050816] px-6 text-white">
      {/* GLOW */}
      <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* CARD */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-2xl">
        {/* ICON */}
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-500/10">
          <Ghost className="h-12 w-12 text-cyan-400" />
        </div>

        {/* 404 */}
        <h1 className="mt-8 text-7xl font-black tracking-tight text-white">
          404
        </h1>

        {/* TITLE */}
        <h2 className="mt-4 text-3xl font-bold">Page Not Found</h2>

        {/* DESC */}
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-zinc-400 md:text-base">
          The page you are looking for does not exist, may have been removed, or
          the URL might be incorrect.
        </p>

        {/* BUTTONS */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="rounded-2xl bg-cyan-500 px-6 py-3 text-sm font-bold text-black transition hover:bg-cyan-400"
          >
            Back To Home
          </Link>

          <Link
            href="/"
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:border-cyan-400/40 hover:bg-white/10"
          >
            Browse Movies
          </Link>
        </div>

        {/* EXTRA TEXT */}
        <div className="mt-10 border-t border-white/10 pt-6 text-xs text-zinc-500">
          DailyMovies © 2026
        </div>
      </div>
    </main>
  );
}
