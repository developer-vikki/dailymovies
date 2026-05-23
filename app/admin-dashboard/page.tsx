"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import {
  Plus,
  Film,
  Eye,
  FileText,
  TrendingUp,
  Pencil,
  Trash2,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

/*
|--------------------------------------------------------------------------
| Movie Interface
|--------------------------------------------------------------------------
*/

interface Movie {
  id: string;

  title: string;

  is_published: boolean;

  total_downloads: number;

  created_at: string;

  movie_download_stats?: {
    total_downloads: number;
  };
}

export default function AdminMoviesHomePage() {
  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  const [movies, setMovies] = useState<Movie[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);

  const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);

  const [deleteText, setDeleteText] = useState("");

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    downloads: 0,
  });

  /*
  |--------------------------------------------------------------------------
  | Pagination
  |--------------------------------------------------------------------------
  */

  const limit = 13;

  /*
  |--------------------------------------------------------------------------
  | Fetch Movies
  |--------------------------------------------------------------------------
  */

  async function fetchMovies() {
    setLoading(true);

    const from = (page - 1) * limit;

    const to = from + limit - 1;

    const query = supabase
      .from("movies")
      .select(
        `
        *,
        movie_download_stats!movie_download_stats_movie_id_fkey (
          total_downloads
        )
      `,
      )
      .order("created_at", {
        ascending: false,
      })
      .range(from, to);

    /*
    |--------------------------------------------------------------------------
    | Search
    |--------------------------------------------------------------------------
    */

    if (search) {
      query.ilike("title", `%${search}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      const formattedMovies =
        data.map((movie) => ({
          ...movie,

          total_downloads: movie.movie_download_stats?.total_downloads || 0,
        })) || [];

      setMovies(formattedMovies);
    }

    setLoading(false);
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard Stats
  |--------------------------------------------------------------------------
  */

  async function fetchStats() {
    const { data: moviesData } = await supabase.from("movies").select("*");

    if (!moviesData) return;

    const total = moviesData.length;

    const published = moviesData.filter(
      (movie) => movie.is_published === true,
    ).length;

    const draft = moviesData.filter(
      (movie) => movie.is_published === false,
    ).length;

    /*
    |--------------------------------------------------------------------------
    | Downloads
    |--------------------------------------------------------------------------
    */

    const { data: statsData } = await supabase
      .from("movie_download_stats")
      .select("total_downloads");

    const downloads =
      statsData?.reduce((acc, item) => acc + (item.total_downloads || 0), 0) ||
      0;

    /*
    |--------------------------------------------------------------------------
    | Save Stats
    |--------------------------------------------------------------------------
    */

    setStats({
      total,
      published,
      draft,
      downloads,
    });
  }

  /*
  |--------------------------------------------------------------------------
  | Delete Movie
  |--------------------------------------------------------------------------
  */

  async function deleteMovie() {
    if (!deleteMovieId) return;

    /*
    |--------------------------------------------------------------------------
    | Verify Text
    |--------------------------------------------------------------------------
    */

    if (deleteText !== "SURE DELETE") {
      alert("Please type SURE DELETE");

      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Query
    |--------------------------------------------------------------------------
    */

    const { error } = await supabase
      .from("movies")
      .delete()
      .eq("id", deleteMovieId);

    if (!error) {
      /*
      |--------------------------------------------------------------------------
      | Close Modal
      |--------------------------------------------------------------------------
      */

      setDeleteMovieId(null);

      setDeleteText("");

      /*
      |--------------------------------------------------------------------------
      | Refresh
      |--------------------------------------------------------------------------
      */

      fetchMovies();

      fetchStats();
    }
  }

  /*
  |--------------------------------------------------------------------------
  | useEffect
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchMovies();
  }, [page, search]);

  useEffect(() => {
    fetchStats();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Dashboard Cards
  |--------------------------------------------------------------------------
  */

  const statCards = [
    {
      title: "Total Movies",
      value: stats.total,
      icon: Film,
      color: "from-blue-500/20 to-cyan-500/10",
    },

    {
      title: "Published",
      value: stats.published,
      icon: TrendingUp,
      color: "from-green-500/20 to-emerald-500/10",
    },

    {
      title: "Draft",
      value: stats.draft,
      icon: FileText,
      color: "from-yellow-500/20 to-orange-500/10",
    },

    {
      title: "Total Downloads",
      value: stats.downloads,
      icon: Eye,
      color: "from-purple-500/20 to-fuchsia-500/10",
    },
  ];

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        {/* Left */}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">
            Movies Dashboard
          </h1>

          <p className="text-zinc-400 mt-2">Manage all uploaded movies</p>
        </div>

        {/* Right */}
        <Link
          href="/admin-dashboard/upload"
          className="inline-flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl px-6 py-4 hover:opacity-90 transition"
        >
          <Plus className="w-5 h-5" />

          <span className="font-semibold">Upload Movie</span>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {statCards.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className={`bg-linear-to-br ${item.color} border border-white/10 rounded-3xl p-5 backdrop-blur-sm`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-zinc-400 text-sm">{item.title}</p>

                  <h2 className="text-3xl font-bold mt-2">{item.value}</h2>
                </div>

                <div className="bg-white/10 p-3 rounded-2xl">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Table Wrapper */}
      <div className="bg-white/3 border border-white/10 rounded-3xl overflow-hidden">
        {/* Top */}
        <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left */}
          <div>
            <h2 className="text-2xl font-semibold">Movies</h2>

            <p className="text-zinc-400 text-sm mt-1">Manage uploaded movies</p>
          </div>

          {/* Search */}
          <div className="relative w-full lg:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />

            <input
              type="text"
              placeholder="Search movies..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);

                setPage(1);
              }}
              className="w-full bg-[#111] border border-white/10 rounded-2xl pl-11 pr-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Head */}
            <thead className="bg-white/2 border border-white/10 rounded-3xl p-5 backdrop-blur-sm">
              <tr className="text-left text-zinc-400 text-sm">
                <th className="px-6 py-4">Movie</th>

                <th className="px-6 py-4">Status</th>

                <th className="px-6 py-4">Downloads</th>

                <th className="px-6 py-4">Created</th>

                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Body */}
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-zinc-400">
                    Loading movies...
                  </td>
                </tr>
              ) : movies.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-14 text-zinc-400">
                    No movies found
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr
                    key={movie.id}
                    className="border-t border-white/5 hover:bg-white/10 transition"
                  >
                    {/* Movie */}
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="font-semibold text-white">
                          {movie.title}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold ${
                          movie.is_published
                            ? "bg-emerald-500/15 text-emerald-400"
                            : "bg-yellow-500/15 text-yellow-400"
                        }`}
                      >
                        <span className="w-2 h-2 rounded-full bg-current" />

                        {movie.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Downloads */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-zinc-300">
                        <Eye className="w-4 h-4 text-cyan-400" />

                        <span>{movie.total_downloads || 0}</span>
                      </div>
                    </td>

                    {/* Created */}
                    <td className="px-6 py-5 text-zinc-400">
                      {new Date(movie.created_at).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex items-center justify-end gap-3">
                        {/* Edit */}
                        <Link
                          href={`/admin-dashboard/edit/${movie.id}`}
                          className="bg-blue-500/15 hover:bg-blue-500/25 text-blue-400 p-2.5 rounded-xl transition"
                        >
                          <Pencil className="w-4 h-4" />
                        </Link>

                        {/* Delete */}
                        <button
                          onClick={() => setDeleteMovieId(movie.id)}
                          className="bg-red-500/15 hover:bg-red-500/25 text-red-400 p-2.5 rounded-xl transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-5 border-t border-white/10 flex items-center justify-between">
          {/* Previous */}
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-50 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          {/* Page */}
          <div className="text-zinc-400 text-sm">Page {page}</div>

          {/* Next */}
          <button
            onClick={() => setPage(page + 1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteMovieId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-3xl p-6 shadow-2xl">
            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="bg-red-500/15 p-3 rounded-2xl">
                <Trash2 className="w-5 h-5 text-red-400" />
              </div>

              <div>
                <h2 className="text-2xl font-bold">Delete Movie</h2>

                <p className="text-zinc-500 text-sm mt-1">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="mt-6">
              <p className="text-zinc-400 leading-7">
                Type{" "}
                <span className="text-red-400 font-semibold">SURE DELETE</span>{" "}
                to permanently delete this movie from your database.
              </p>

              {/* Input */}
              <input
                type="text"
                value={deleteText}
                onChange={(e) => setDeleteText(e.target.value)}
                placeholder="Type SURE DELETE"
                className="w-full mt-5 bg-[#18181B] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/20 transition"
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 mt-7">
              {/* Cancel */}
              <button
                onClick={() => {
                  setDeleteMovieId(null);

                  setDeleteText("");
                }}
                className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 transition"
              >
                Cancel
              </button>

              {/* Delete */}
              <button
                onClick={deleteMovie}
                disabled={deleteText !== "SURE DELETE"}
                className="px-5 py-3 rounded-2xl bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Delete Movie
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
