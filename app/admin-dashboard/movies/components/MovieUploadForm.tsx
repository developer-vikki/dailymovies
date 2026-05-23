"use client";

import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Category } from "./types";
import { createClient } from "@/lib/supabase/client";
import CreateCategoryDialog from "./CreateCategoryDialog";

export default function MovieUploadForm() {
  // Initialize Supabase client
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");

  const [slug, setSlug] = useState("");

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/\s+/g, "-");
  }

  const [description, setDescription] = useState("");
  // release_date
  const [releaseDate, setReleaseDate] = useState("");
  // duration_minutes
  const [duration, setDuration] = useState("");
  // imdb_rating
  const [rating, setRating] = useState("");
  // poster_url
  const [posterFile, setPosterFile] = useState<File | null>(null);
  // trailer_url
  const [trailerUrl, setTrailerUrl] = useState("");
  // language
  const [language, setLanguage] = useState("");
  // country
  const [country, setCountry] = useState("");
  // is_published
  const [isPublished, setIsPublished] = useState(false);
  // uploaded_by
  const [uploadedBy, setUploadedBy] = useState("");
  // upload movie to supabase
  const [categories, setCategories] = useState<Category[]>([]);
  // selected categories for the movie
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // screenshots for the movie
  const [screenshots, setScreenshots] = useState<File[]>([]);

  async function handleSubmit() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("Login required");

        return;
      }

      let uploadedPosterUrl = "";

      if (posterFile) {
        uploadedPosterUrl = await uploadPoster(posterFile);
      }

      const { data: movie, error } = await supabase
        .from("movies")
        .insert({
          title,
          slug,
          description,

          language,
          country,
          poster_url: uploadedPosterUrl || null,
          release_date: releaseDate || null,

          duration_minutes: duration ? Number(duration) : null,

          imdb_rating: rating ? Number(rating) : null,

          trailer_url: trailerUrl || null,

          uploaded_by: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error(error);

        alert(error.message);

        return;
      }

      if (movie && selectedCategories.length > 0) {
        const { error: categoryError } = await supabase
          .from("movie_categories")
          .insert(
            selectedCategories.map((categoryId) => ({
              movie_id: movie.id,
              category_id: categoryId,
            })),
          );

        if (categoryError) {
          console.error(categoryError);

          alert(categoryError.message);

          return;
        }
      }

      alert("Movie uploaded successfully");
      if (screenshots.length > 0) {
        for (const screenshot of screenshots) {
          const imageUrl = await uploadScreenshot(screenshot, movie.id);

          const { error: screenshotError } = await supabase
            .from("movie_screenshots")
            .insert({
              movie_id: movie.id,
              image_url: imageUrl,
            });

          if (screenshotError) {
            console.error(screenshotError);
          }
        }
      }

      // Reset Form
      setTitle("");
      setSlug("");
      setDescription("");

      setLanguage("");
      setCountry("");

      setReleaseDate("");

      setDuration("");

      setRating("");

      setTrailerUrl("");
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  }
  // Upload poster to Supabase Storage and get public URL
  async function uploadPoster(file: File) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("posters")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage.from("posters").getPublicUrl(fileName);

    return data.publicUrl;
  }
  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);

      return;
    }

    setCategories(data || []);
  }

  // upload screenshots to Supabase Storage and get public URLs
  async function uploadScreenshot(file: File, movieId: string) {
    const fileName = `${movieId}/${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("screenshots")
      .upload(fileName, file, {
        upsert: true,
      });

    if (error) {
      throw error;
    }

    const { data } = supabase.storage
      .from("screenshots")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Upload Movie</h1>

        <p className="text-zinc-400 mt-2">Add movie content</p>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Movie Title</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSlug(generateSlug(e.target.value));
              }}
              placeholder="Inception"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>

          <div className="space-y-2">
            <Label>Slug</Label>
            <Input
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="inception-2010"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter movie plot summary..."
            className="bg-zinc-950 border-zinc-800 min-h-25"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label>Release Date</Label>
            <Input
              type="date"
              value={releaseDate}
              onChange={(e) => setReleaseDate(e.target.value)}
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (Minutes)</Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              placeholder="148"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label>IMDB Rating</Label>
            <Input
              type="text"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              placeholder="8.8"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Language</Label>
            <Input
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="English"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
          <div className="space-y-2">
            <Label>Country</Label>
            <Input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              placeholder="USA"
              className="bg-zinc-950 border-zinc-800"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Trailer URL</Label>
          <Input
            value={trailerUrl}
            onChange={(e) => setTrailerUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=..."
            className="bg-zinc-950 border-zinc-800"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Categories</Label>

            <CreateCategoryDialog
              onCreated={(categoryId) => {
                fetchCategories();

                setSelectedCategories((prev) => [...prev, categoryId]);
              }}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {categories.map((category) => (
              <label
                key={category.id}
                className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-xl p-3"
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

        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="published"
            checked={isPublished}
            onCheckedChange={setIsPublished}
          />
          <Label htmlFor="published">Published</Label>
        </div>
        <div className="space-y-3">
          <Label>Poster</Label>

          <Input
            type="file"
            accept="image/*"
            onChange={(e) => setPosterFile(e.target.files?.[0] || null)}
            className="bg-zinc-950 border-zinc-800"
          />

          {posterFile && (
            <img
              src={URL.createObjectURL(posterFile)}
              alt="Poster Preview"
              className="w-40 rounded-xl border border-zinc-800"
            />
          )}
        </div>
        {/* screenshots upload multiple with preview using shadcn */}
        <div className="space-y-3">
          <Label>Screenshots</Label>
          <Input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) =>
              setScreenshots(Array.from(e.target.files || []).slice(0, 5))
            }
            className="bg-zinc-950 border-zinc-800"
          />
          <div className="flex flex-wrap gap-3">
            {screenshots.map((file, index) => (
              <img
                key={index}
                src={URL.createObjectURL(file)}
                alt={`Screenshot ${index + 1} Preview`}
                className="w-40 rounded-xl border border-zinc-800"
              />
            ))}
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 rounded-xl py-3 font-semibold"
        >
          {loading ? "Uploading..." : "Upload Movie"}
        </button>
      </div>
    </div>
  );
}
