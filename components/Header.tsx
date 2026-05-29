// components/layout/header.tsx

"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Clapperboard, Mail } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/", icon: null },
  { label: "Anime", href: "/?category=anime", icon: null },
  { label: "Web Series", href: "/?category=web-series", icon: null },
  { label: "Adult Show", href: "/?category=adult-show", icon: null },
  { label: "Contact Us", href: "/contact-us", icon: Mail },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  const searchParams = useSearchParams();
  const router = useRouter();

  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search") || "";

  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value.trim()) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <header
      role="banner"
      className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/90 backdrop-blur-2xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 lg:border-none">
          {/* Logo */}
          <Link
            href="/"
            aria-label="DailyMovie Home"
            className="flex items-center gap-3"
          >
            <div
              aria-hidden="true"
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10"
            >
              <Clapperboard className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <span className="block text-2xl font-black tracking-tight text-white">
                Daily<span className="text-cyan-300">Movie</span>
              </span>

              <p
                aria-hidden="true"
                className="text-[10px] uppercase tracking-[0.25em] text-white/35"
              >
                Movies Hub
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Primary Navigation"
            className="hidden items-center gap-8 lg:flex"
          >
            {navItems.map((item) => {
              const itemCategory = item.href.split("category=")[1] || null;

              const active =
                item.label !== "Contact Us" &&
                (currentCategory === itemCategory ||
                  (!currentCategory && item.label === "Home"));

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-label={item.label}
                  className={`relative text-sm font-medium transition ${
                    active ? "text-cyan-300" : "text-white/65 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.icon && (
                      <item.icon aria-hidden="true" className="h-3.5 w-3.5" />
                    )}
                    {item.label}
                  </span>

                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-cyan-300"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
          >
            {open ? (
              <X aria-hidden="true" className="h-5 w-5" />
            ) : (
              <Menu aria-hidden="true" className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Search */}
        <div className="flex h-14 items-center pb-3 pt-1">
          <div className="flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition focus-within:border-cyan-400/30">
            <Search aria-hidden="true" className="h-4 w-4 text-white/40" />

            <label htmlFor="movie-search" className="sr-only">
              Search movies, web series and anime
            </label>

            <input
              id="movie-search"
              type="search"
              defaultValue={currentSearch}
              placeholder="Search movies, series, anime..."
              aria-label="Search movies, web series and anime"
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {open && (
        <div
          id="mobile-menu"
          className="border-t border-white/10 bg-[#050816] p-4 lg:hidden"
        >
          <nav aria-label="Mobile Navigation" className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                aria-label={item.label}
                onClick={() => setOpen(false)}
                className="rounded-xl px-4 py-3 text-sm font-medium text-white/65 transition hover:bg-white/5 hover:text-cyan-300"
              >
                <span className="flex items-center gap-2">
                  {item.icon && (
                    <item.icon aria-hidden="true" className="h-4 w-4" />
                  )}
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
