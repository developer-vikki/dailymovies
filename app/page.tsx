import Header from "@/components/Header";
import CategoriesSection from "@/components/home/Categories";
import HeroSection from "@/components/home/HeroSection";
import MovieFeed from "@/components/MovieFeed/MovieFeed";

export default function Home() {
  return (
    <main>
      <Header />

      <HeroSection />
      <CategoriesSection />
      <MovieFeed />
    </main>
  );
}
