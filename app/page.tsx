import Header from "@/components/Header";
import CategoriesSection from "@/components/home/Categories";
import HeroSection from "@/components/home/HeroSection";
import MovieFeeds from "@/components/home/MovieFeeds";

export default function Home() {
  return (
    <main>
      {/* Header */}
      <Header />
      {/* Hero Section */}
      <HeroSection />
      {/* Categories */}
      <CategoriesSection />
      {/* Movie Feeds */}
      <MovieFeeds />
    </main>
  );
}
