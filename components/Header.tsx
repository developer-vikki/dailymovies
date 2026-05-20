// components/layout/header.tsx

"use client";

import Link from "next/link";
import { useState } from "react";

import { Menu, X, Search, Sparkles, Clapperboard } from "lucide-react";

import { useSearchParams, useRouter } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Anime", href: "/?category=anime" },
  { label: "Web Series", href: "/?category=web-series" },
  { label: "Adult Show", href: "/?category=adult-show" },
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
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#050816]/80 backdrop-blur-2xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="flex h-20 items-center justify-between">
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
                currentCategory === itemCategory ||
                (!currentCategory && item.label === "Home");

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`relative text-sm font-medium transition ${
                    active ? "text-cyan-300" : "text-white/65 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {active && <Sparkles className="h-3.5 w-3.5" />}
                    {item.label}
                  </span>

                  {active && (
                    <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-cyan-300" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search */}
          <div className="hidden xl:flex items-center gap-3">
            <div className="flex h-12 w-[320px] items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4">
              <Search className="h-4 w-4 text-white/40" />

              <input
                type="text"
                defaultValue={currentSearch}
                placeholder="Search movies..."
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder:text-white/35 outline-none"
              />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
