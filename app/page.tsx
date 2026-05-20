import Header from "@/components/Header";
import CategoriesSection from "@/components/home/Categories";
import HeroSection from "@/components/home/HeroSection";
import MovieFeeds from "@/components/home/MovieFeeds";
import { Suspense } from "react";

export default function Home() {
  return (
    <main>
      {/* Header */}
      <Suspense fallback={<div className="text-white">Loading header...</div>}>
        <Header />
      </Suspense>
      {/* Hero Section */}
      <HeroSection />
      {/* Categories */}
      <CategoriesSection />
      {/* Movie Feeds */}
      <Suspense fallback={<div className="text-white">Loading movies...</div>}>
        <MovieFeeds />
      </Suspense>
    </main>
  );
}
