import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",

        allow: ["/", "/media/", "/category/"],

        disallow: ["/api/", "/admin/", "/dashboard/"],
      },
    ],

    sitemap: "https://dailymovies.online/sitemap.xml",

    host: "https://dailymovies.online",
  };
}
