"use client";

import { useEffect, useState } from "react";
import { Upload, Film, ImageIcon, Loader2 } from "lucide-react";

import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
};

export default function AdminMoviesPage() {
  const supabase = createClient();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [duration, setDuration] = useState("");
  const [rating, setRating] = useState("");
  const [previewVideo, setPreviewVideo] = useState("");

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const [posterFile, setPosterFile] = useState<File | null>(null);

  const [screenshots, setScreenshots] = useState<File[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (!error && data) {
      setCategories(data);
    }
  }

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  }

  // =========================
  // Upload Poster
  // =========================
  async function uploadPoster(file: File) {
    const path = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("posters")
      .upload(path, file, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("posters").getPublicUrl(path);

    return data.publicUrl;
  }

  // =========================
  // Upload Screenshot
  // =========================
  async function uploadScreenshot(file: File, movieId: string) {
    const path = `${movieId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("screenshots")
      .upload(path, file, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("screenshots").getPublicUrl(path);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    try {
      setLoading(true);

      // =========================
      // Get Current User
      // =========================
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Login required");
        return;
      }

      // =========================
      // Upload Poster
      // =========================
      let posterUrl = "";

      if (posterFile) {
        posterUrl = await uploadPoster(posterFile);
      }

      // =========================
      // Insert Movie
      // =========================
      const { data: movie, error: movieError } = await supabase
        .from("movies")
        .insert({
          title,
          slug,
          description,
          release_date: releaseDate || null,
          duration_minutes: duration ? Number(duration) : null,
          imdb_rating: rating ? Number(rating) : null,
          poster_url: posterUrl || null,
          preview_video_url: previewVideo || null,
          user_id: user.id,
        })
        .select()
        .single();

      if (movieError) {
        console.error(movieError);
        throw movieError;
      }

      // =========================
      // Save Categories
      // =========================
      if (selectedCategories.length > 0) {
        const rows = selectedCategories.map((categoryId) => ({
          movie_id: movie.id,
          category_id: categoryId,
        }));

        const { error: categoryError } = await supabase
          .from("movie_categories")
          .insert(rows);

        if (categoryError) {
          console.error(categoryError);
          throw categoryError;
        }
      }

      // =========================
      // Upload Screenshots
      // =========================
      if (screenshots.length > 0) {
        for (const file of screenshots) {
          await uploadScreenshot(file, movie.id);
        }
      }

      alert("Movie uploaded successfully!");

      // =========================
      // Reset Form
      // =========================
      setTitle("");
      setSlug("");
      setDescription("");
      setReleaseDate("");
      setDuration("");
      setRating("");
      setPreviewVideo("");

      setSelectedCategories([]);

      setPosterFile(null);

      setScreenshots([]);
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Upload Movie</h1>

        <p className="text-zinc-400 mt-2">Manage and upload movie content</p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
        {/* Left */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-5">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Movie Information</h2>
            </div>

            {/* Title */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Movie Title
              </label>

              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setSlug(generateSlug(e.target.value));
                }}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Enter movie title"
                required
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">Slug</label>

              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                placeholder="movie-slug"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Description
              </label>

              <textarea
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                placeholder="Movie description..."
              />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block mb-2 text-sm text-zinc-400">
                  Release Date
                </label>

                <input
                  type="date"
                  value={releaseDate}
                  onChange={(e) => setReleaseDate(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-zinc-400">
                  Duration
                </label>

                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="120"
                />
              </div>

              <div>
                <label className="block mb-2 text-sm text-zinc-400">
                  IMDb Rating
                </label>

                <input
                  type="number"
                  step="0.1"
                  max="10"
                  min="0"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                  placeholder="8.5"
                />
              </div>
            </div>

            {/* Preview Video */}
            <div>
              <label className="block mb-2 text-sm text-zinc-400">
                Trailer / Preview URL
              </label>

              <input
                type="text"
                value={previewVideo}
                onChange={(e) => setPreviewVideo(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 outline-none focus:border-blue-500"
                placeholder="https://youtube.com/..."
              />
            </div>
          </div>

          {/* Categories */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-5">Categories</h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedCategories((prev) => [...prev, category.id]);
                      } else {
                        setSelectedCategories((prev) =>
                          prev.filter((id) => id !== category.id),
                        );
                      }
                    }}
                  />

                  <span>{category.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="space-y-6">
          {/* Poster */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <ImageIcon className="w-5 h-5 text-pink-500" />

              <h2 className="text-lg font-semibold">Poster Upload</h2>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
              className="w-full"
            />
          </div>

          {/* Screenshots */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Upload className="w-5 h-5 text-green-500" />

              <h2 className="text-lg font-semibold">Screenshots</h2>
            </div>

            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setScreenshots(Array.from(e.target.files || []))}
              className="w-full"
            />

            {screenshots.length > 0 && (
              <div className="mt-4 space-y-2">
                {screenshots.map((file, index) => (
                  <div key={index} className="text-sm text-zinc-400">
                    {file.name}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-2xl py-4 font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5" />
                Upload Movie
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
