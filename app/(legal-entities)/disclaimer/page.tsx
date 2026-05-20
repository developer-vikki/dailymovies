// app/disclaimer/page.tsx

import Header from "@/components/Header";

export default function DisclaimerPage() {
  return (
    <>
      <Header />

      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold tracking-tight">Disclaimer</h1>

          <p className="mt-6 leading-8 text-zinc-300">
            DailyMovies is an independent informational and
            entertainment-related platform.
          </p>

          {/* Section 1 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">No Guarantees</h2>

            <p className="mt-4 text-zinc-300">We do not guarantee:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Accuracy of external content</li>
              <li>Availability of third-party services</li>
              <li>Legality of external websites in every jurisdiction</li>
              <li>Safety of third-party downloads</li>
              <li>Reliability of advertisements or embeds</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              User Responsibility
            </h2>

            <p className="mt-4 text-zinc-300">
              Users are solely responsible for:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Their internet activity</li>
              <li>Compliance with local laws</li>
              <li>Accessing third-party content</li>
              <li>Use of external websites or services</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              Intellectual Property
            </h2>

            <p className="mt-4 text-zinc-300">
              All movie titles, trademarks, logos, posters, and copyrighted
              assets belong to their respective owners.
            </p>

            <p className="mt-4 text-zinc-300">
              DailyMovies does not claim ownership of third-party intellectual
              property unless explicitly stated.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              External References
            </h2>

            <p className="mt-4 text-zinc-300">
              Any external links, embeds, or references are provided for
              informational purposes only.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
