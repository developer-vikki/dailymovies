// import Header from "@/components/Header";
// import CategoriesSection from "@/components/home/Categories";
// import HeroSection from "@/components/home/HeroSection";
// import MovieFeeds from "@/components/home/MovieFeeds";
// import { Suspense } from "react";

// export default function Home() {
//   return (
//     <main>
//       {/* Header */}
//       <Suspense fallback={<div className="text-white">Loading header...</div>}>
//         <Header />
//       </Suspense>
//       {/* Hero Section */}
//       {/* TODO: UN COMMENTS WHEN NEED TO SHOW TRANDING DOWNLOADS */}
//       {/* <HeroSection /> */}
//       {/* Categories */}
//       <CategoriesSection />
//       {/* Movie Feeds */}
//       <Suspense fallback={<div className="text-white">Loading movies...</div>}>
//         <MovieFeeds />
//       </Suspense>
//     </main>
//   );
// }



export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-black text-white px-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-bold mb-6">Domain For Sale</h1>

        <p className="text-xl mb-4">
          The domain <span className="font-semibold">dailymovies.online</span> is
          available for purchase.
        </p>

        <p className="text-lg text-gray-300">
          If you're interested in buying this domain, please contact:
        </p>

        <a
          href="mailto:mrkevinmitnick@zohomail.in"
          className="mt-4 inline-block text-blue-400 hover:text-blue-300 underline text-lg"
        >
          mrkevinmitnick@zohomail.in
        </a>
      </div>
    </main>
  );
}
