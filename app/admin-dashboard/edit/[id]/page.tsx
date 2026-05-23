"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import Link from "next/link";

import { ArrowLeft, Save, Loader2, ImageIcon } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

export default function EditMoviePage() {
  /*
  |--------------------------------------------------------------------------
  | Router
  |--------------------------------------------------------------------------
  */

  const router = useRouter();

  const params = useParams();

  const movieId = params.id as string;

  /*
  |--------------------------------------------------------------------------
  | States
  |--------------------------------------------------------------------------
  */

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Form States
  |--------------------------------------------------------------------------
  */

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [posterUrl, setPosterUrl] = useState("");

  const [language, setLanguage] = useState("");

  const [country, setCountry] = useState("");

  const [duration, setDuration] = useState("");

  const [rating, setRating] = useState("");

  const [trailerUrl, setTrailerUrl] = useState("");

  const [isPublished, setIsPublished] = useState(false);

  const [isFeatured, setIsFeatured] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Fetch Movie
  |--------------------------------------------------------------------------
  */

  async function fetchMovie() {
    setLoading(true);

    const { data, error } = await supabase
      .from("movies")
      .select("*")
      .eq("id", movieId)
      .single();

    if (!error && data) {
      setTitle(data.title || "");

      setDescription(data.description || "");

      setPosterUrl(data.poster_url || "");

      setLanguage(data.language || "");

      setCountry(data.country || "");

      setDuration(data.duration_minutes?.toString() || "");

      setRating(data.imdb_rating?.toString() || "");

      setTrailerUrl(data.trailer_url || "");

      setIsPublished(data.is_published || false);

      setIsFeatured(data.is_featured || false);
    }

    setLoading(false);
  }

  /*
  |--------------------------------------------------------------------------
  | Update Movie
  |--------------------------------------------------------------------------
  */

  async function updateMovie() {
    if (!title) {
      alert("Movie title required");

      return;
    }

    setSaving(true);

    /*
    |--------------------------------------------------------------------------
    | Create Slug
    |--------------------------------------------------------------------------
    */

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");

    /*
    |--------------------------------------------------------------------------
    | Update Query
    |--------------------------------------------------------------------------
    */

    const { error } = await supabase
      .from("movies")
      .update({
        title,

        slug,

        description,

        poster_url: posterUrl,

        language,

        country,

        duration_minutes: duration ? Number(duration) : null,

        imdb_rating: rating ? Number(rating) : null,

        trailer_url: trailerUrl,

        is_published: isPublished,

        is_featured: isFeatured,
      })
      .eq("id", movieId);

    setSaving(false);

    if (!error) {
      alert("Movie updated successfully");

      router.push("/admin-dashboard/");
    }
  }

  /*
  |--------------------------------------------------------------------------
  | useEffect
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (movieId) {
      fetchMovie();
    }
  }, [movieId]);

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-8">
        {/* Left */}
        <div>
          <Link
            href="/admin-dashboard/"
            className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-4 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Movies
          </Link>

          <h1 className="text-4xl font-bold">Edit Movie</h1>

          <p className="text-zinc-400 mt-2">Update movie details</p>
        </div>

        {/* Save Button */}
        <button
          onClick={updateMovie}
          disabled={saving}
          className="inline-flex items-center justify-center gap-3 bg-linear-to-r from-blue-600 to-cyan-500 rounded-2xl px-6 py-4 hover:opacity-90 transition disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}

          <span className="font-semibold">
            {saving ? "Saving..." : "Save Changes"}
          </span>
        </button>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left */}
        <div className="xl:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white/3 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Basic Information</h2>

            <div className="space-y-5">
              {/* Title */}
              <div>
                <label className="text-sm text-zinc-400">Movie Title</label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter movie title"
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-sm text-zinc-400">Description</label>

                <textarea
                  rows={6}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Movie description"
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500 resize-none"
                />
              </div>

              {/* Trailer */}
              <div>
                <label className="text-sm text-zinc-400">Trailer URL</label>

                <input
                  type="text"
                  value={trailerUrl}
                  onChange={(e) => setTrailerUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="bg-white/3 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Movie Details</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Language */}
              <div>
                <label className="text-sm text-zinc-400">Language</label>

                <input
                  type="text"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  placeholder="English"
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              {/* Country */}
              <div>
                <label className="text-sm text-zinc-400">Country</label>

                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  placeholder="USA"
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              {/* Duration */}
              <div>
                <label className="text-sm text-zinc-400">
                  Duration (Minutes)
                </label>

                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="120"
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>

              {/* Rating */}
              <div>
                <label className="text-sm text-zinc-400">IMDb Rating</label>

                <input
                  type="number"
                  step="0.1"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  placeholder="8.5"
                  className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Poster */}
          <div className="bg-white/3 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Poster</h2>

            {posterUrl ? (
              <img
                src={posterUrl}
                alt={title}
                className="w-full h-87.5 object-cover rounded-2xl border border-white/10"
              />
            ) : (
              <div className="w-full h-87.5 rounded-2xl border border-dashed border-white/10 flex items-center justify-center text-zinc-500">
                <div className="flex flex-col items-center gap-3">
                  <ImageIcon className="w-10 h-10" />

                  <span>No Poster</span>
                </div>
              </div>
            )}

            <div className="mt-5">
              <label className="text-sm text-zinc-400">Poster URL</label>

              <input
                type="text"
                value={posterUrl}
                onChange={(e) => setPosterUrl(e.target.value)}
                placeholder="https://..."
                className="w-full mt-2 bg-[#111] border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Status */}
          <div className="bg-white/3 border border-white/10 rounded-3xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Publish Settings</h2>

            <div className="space-y-5">
              {/* Published */}
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Published</p>

                  <p className="text-sm text-zinc-500 mt-1">
                    Show movie publicly
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-5 h-5"
                />
              </label>

              {/* Featured */}
              <label className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Featured</p>

                  <p className="text-sm text-zinc-500 mt-1">
                    Highlight on homepage
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-5 h-5"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
