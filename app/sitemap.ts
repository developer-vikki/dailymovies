import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/client";

export const revalidate = 3600;

// TYPES
type Movie = {
  slug: string;

  created_at: string | null;

  category: {
    slug: string;
  } | null;
};

type Category = {
  slug: string;
};

// SUPABASE
const supabase = createClient();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://dailymovies.online/";

  // FETCH MOVIES
  const { data: movies, error: movieError } = await supabase
    .from("movies")
    .select(
      `
      slug,
      created_at,

      category:categories!movies_category_id_fkey (
        slug
      )
    `,
    )
    .returns<Movie[]>();

  if (movieError) {
    console.log("MOVIE ERROR:", movieError);
  }

  // FETCH CATEGORIES
  const { data: categories } = await supabase
    .from("categories")
    .select("slug")
    .returns<Category[]>();

  // STATIC ROUTES
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,

      lastModified: new Date(),

      changeFrequency: "daily",

      priority: 1,
    },
  ];

  // CATEGORY ROUTES
  const categoryRoutes: MetadataRoute.Sitemap = (categories || []).map(
    (category) => ({
      url: `${baseUrl}/${category.slug}`,

      lastModified: new Date(),

      changeFrequency: "daily",

      priority: 0.8,
    }),
  );

  // MOVIE ROUTES
  const movieRoutes: MetadataRoute.Sitemap = (movies || [])
    .filter((movie) => movie.slug && movie.category?.slug)
    .map((movie) => ({
      url: `${baseUrl}/media/${movie.category?.slug}/${movie.slug}`,

      lastModified: movie.created_at ? new Date(movie.created_at) : new Date(),

      changeFrequency: "weekly",

      priority: 0.7,
    }));

  // FINAL SITEMAP
  return [...staticRoutes, ...categoryRoutes, ...movieRoutes];
}
