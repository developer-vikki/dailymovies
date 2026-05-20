// components/layout/footer.tsx

"use client";

import Link from "next/link";
import { ArrowUp, Clapperboard, Send } from "lucide-react";
import { FaInstagram, FaTelegram } from "react-icons/fa6";

export default function Footer() {
  const scrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const socialLinks = [
    { icon: FaInstagram, href: "https://instagram.com/dailymovie_watch" },
    { icon: FaTelegram, href: "https://t.me/dailymovie_watch" },
  ];

  const quickLinks = [
    { label: "Home", href: "/" },
    { label: "Movies", href: "/?category=movies" },
    { label: "TV Shows", href: "/?category=tv-shows" },
    { label: "Trending", href: "/?category=trending" },
    { label: "New Releases", href: "/?category=new-releases" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms of Service", href: "/terms-conditions" },
    { label: "DMCA", href: "/dmca" },
    { label: "Disclaimer", href: "/disclaimer" },
  ];

  const categories = [
    { label: "Action", href: "/?category=action" },
    { label: "Sci-Fi", href: "/?category=sci-fi" },
    { label: "Anime", href: "/?category=anime" },
    { label: "Comedy", href: "/?category=comedy" },
    { label: "Horror", href: "/?category=horror" },
  ];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#030712]">
      {/* Glow Effects */}
      <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-cyan-500/10 blur-[120px]" />
      <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section */}
        <div className="grid gap-14 py-16 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
                <Clapperboard className="h-5 w-5 text-cyan-300" />
              </div>

              <div>
                <h2 className="text-3xl font-black tracking-tight text-white">
                  daily<span className="text-cyan-300">movie</span>
                </h2>

                <p className="text-[10px] uppercase tracking-[0.25em] text-white/35">
                  future streaming
                </p>
              </div>
            </div>

            <p className="mt-6 max-w-sm text-sm leading-7 text-white/50">
              Stream and explore trending movies, anime, and web series with
              ultra-fast modern experience.
            </p>

            {/* Social */}
            <div className="mt-7 flex items-center gap-3">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  target="_blank"
                  className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
              Navigation
            </h3>

            <div className="mt-6 flex flex-col gap-4">
              {quickLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="w-fit text-sm text-white/60 transition hover:text-cyan-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
              Categories
            </h3>

            <div className="mt-6 flex flex-wrap gap-3">
              {categories.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-200 transition hover:bg-cyan-400/20"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-white/40">
              Community
            </h3>

            <p className="mt-6 text-sm leading-7 text-white/50">
              Join our Telegram channel and get instant updates about latest
              uploads and trending movies.
            </p>

            <Link href="https://t.me/dailymovie_watch" target="_blank">
              <button className="group mt-7 flex h-12 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10">
                <Send className="h-4 w-4 text-cyan-300 transition group-hover:translate-x-1" />
                Join Telegram
              </button>
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col gap-5 border-t border-white/10 py-6 md:flex-row md:items-center md:justify-between">
          {/* Copyright */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-5">
            <p className="text-sm text-white/35">
              © 2026 dailymovie. All rights reserved.
            </p>

            <div className="hidden h-4 w-px bg-white/10 md:block" />

            <div className="flex items-center gap-5">
              {legalLinks.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-xs text-white/35 transition hover:text-cyan-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Scroll Top */}
          <button
            onClick={scrollTop}
            className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-cyan-300"
          >
            <ArrowUp className="h-5 w-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
