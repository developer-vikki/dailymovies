import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 3600;

type Movie = {
  slug: string;
  created_at: string | null;
  movie_categories: {
    categories: {
      slug: string;
    } | null;
  }[];
};

type Category = {
  slug: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const baseUrl = "https://dailymovies.online";

  // Fetch Movies with Categories
  const { data: movies, error: movieError } = await supabase
    .from("movies")
    .select(
      `
      slug,
      created_at,
      movie_categories (
        categories (
          slug
        )
      )
    `,
    )
    .returns<Movie[]>();

  if (movieError) {
    console.error("MOVIE ERROR:", movieError);
  }

  // Fetch Categories
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("slug")
    .returns<Category[]>();

  if (categoryError) {
    console.error("CATEGORY ERROR:", categoryError);
  }

  // Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  // Category Routes
  const categoryRoutes: MetadataRoute.Sitemap = (categories ?? []).map(
    (category) => ({
      url: `${baseUrl}/?category=${category.slug}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    }),
  );

  // Movie Routes
  const movieRoutes: MetadataRoute.Sitemap = [];

  (movies ?? []).forEach((movie) => {
    movie.movie_categories?.forEach((mc) => {
      const categorySlug = mc.categories?.slug;

      if (categorySlug) {
        movieRoutes.push({
          url: `${baseUrl}/media/${categorySlug}/${movie.slug}`,
          lastModified: movie.created_at
            ? new Date(movie.created_at)
            : new Date(),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    });
  });

  return [...staticRoutes, ...categoryRoutes, ...movieRoutes];
}
