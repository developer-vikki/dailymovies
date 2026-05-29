// components/home/categories-section.tsx

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

export default function CategoriesSection() {
  const [categories, setCategories] = useState<Category[]>([]);
  const pathname = usePathname();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  async function fetchCategories() {
    const { data, error } = await createClient()
      .from("categories")
      .select("*")
      .order("name");

    if (error) {
      console.error(error);

      setLoading(false);

      return;
    }

    setCategories(data || []);

    setLoading(false);
  }

  return (
    <section className="p-8">
      {/* Heading */}
      <div className="mb-5">
        <h2 className="text-2xl font-black text-foreground">
          Browse Categories
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Explore movies by categories & genres
        </p>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-3 p-5 rounded-xl bg-white/5 text-center">
        <Link
          href="/"
          className={`
                group relative overflow-hidden
                rounded-xl
                border border-white/10
                px-5 py-3
                text-xs font-semibold text-white
                transition-all duration-300
                hover:-translate-y-0.5
                hover:border-white/20
                ${
                  pathname === "/"
                    ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300"
                    : "bg-[#232323]"
                }
              `}
        >
          All
        </Link>
        {loading &&
          Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="
                h-10 w-28 animate-pulse
                rounded-xl
                bg-white/5
              "
            />
          ))}

        {!loading &&
          categories.map((category) => (
            <Link
              key={category.id}
              href={`/?category=${category.slug}`}
              className="
                group relative overflow-hidden
                rounded-xl
                border border-white/10
                bg-[#232323]
                px-5 py-3

                text-xs font-semibold text-white

                transition-all duration-300

                hover:-translate-y-0.5
                hover:border-white/20
              "
              style={{
                background: `${category.color}15`,
                borderColor: `${category.color}30`,
              }}
            >
              {/* Glow */}
              <div
                className="
                  absolute inset-0 opacity-0 blur-2xl
                  transition-opacity duration-300
                  group-hover:opacity-100
                "
                style={{
                  background: category.color,
                }}
              />

              {/* Text */}
              <span className="relative z-10">{category.name}</span>
            </Link>
          ))}
      </div>
    </section>
  );
}
