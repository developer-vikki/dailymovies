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

  // GET CURRENT PARAMS
  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search") || "";

  // SEARCH HANDLER
  function handleSearch(value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/90 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Row 1: Logo & Nav & Mobile Toggle */}
        <div className="flex h-16 items-center justify-between border-b border-white/5 lg:border-none">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <Clapperboard className="h-5 w-5 text-cyan-300" />
            </div>

            <div>
              <h1 className="text-2xl font-black tracking-tight text-white">
                Daily<span className="text-cyan-300">Movie</span>
              </h1>

              <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                Movies Hub
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
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
                  className={`relative text-sm font-medium transition ${
                    active ? "text-cyan-300" : "text-white/65 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {item.icon && <item.icon className="h-3.5 w-3.5" />}
                    {item.label}
                  </span>

                  {active && (
                    <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-cyan-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Row 2: Search Bar (Visible on all screens) */}
        <div className="flex h-14 items-center pb-3 pt-1">
          <div className="flex h-10 w-full max-w-md items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 transition-focus-within:border-cyan-400/30">
            <Search className="h-4 w-4 text-white/40" />
            <input
              type="text"
              defaultValue={currentSearch}
              placeholder="Search movies, series, anime..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu & Search */}
      {open && (
        <div className="lg:hidden border-t border-white/10 bg-[#050816] p-4">
          {/* Mobile Nav Links */}
          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="px-4 py-3 text-sm font-medium text-white/65 hover:text-cyan-300 hover:bg-white/5 rounded-xl transition"
              >
                <span className="flex items-center gap-2">
                  {item.icon && <item.icon className="h-4 w-4" />}
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
