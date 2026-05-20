// app/dmca/page.tsx

import Header from "@/components/Header";
import { Suspense } from "react";

export default function DMCAPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold tracking-tight">
            DMCA / Copyright Policy
          </h1>

          <p className="mt-4 text-zinc-400">
            <strong>Effective Date:</strong> May 20, 2026
          </p>

          <p className="mt-6 leading-8 text-zinc-300">
            DailyMovies respects the intellectual property rights of copyright
            owners.
          </p>

          {/* Section 1 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              1. COPYRIGHT POLICY
            </h2>

            <p className="mt-4 text-zinc-300">
              If you believe that any content available on DailyMovies infringes
              your copyright, you may submit a copyright notice containing:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Your full legal name</li>
              <li>Proof of ownership</li>
              <li>Identification of copyrighted work</li>
              <li>URL of allegedly infringing material</li>
              <li>Contact information</li>
              <li>A good-faith statement</li>
              <li>
                A statement under penalty of perjury that the information is
                accurate
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              2. SUBMITTING A NOTICE
            </h2>

            <p className="mt-4 text-zinc-300">
              Copyright complaints may be sent to:
            </p>

            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-zinc-300">
                Email:{" "}
                <span className="font-medium text-white">
                  copyright@dailymovies.example
                </span>
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              3. REVIEW PROCESS
            </h2>

            <p className="mt-4 text-zinc-300">
              Upon receiving a valid complaint, we may:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Review the request</li>
              <li>Remove or disable access</li>
              <li>Request additional verification</li>
              <li>Take appropriate action under applicable laws</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              4. REPEAT INFRINGEMENT
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies reserves the right to restrict or terminate access for
              repeated copyright violations where applicable.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              5. THIRD-PARTY CONTENT
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies may reference, embed, or link to external content
              hosted by third parties.
            </p>

            <p className="mt-4 text-zinc-300">
              We do not claim ownership of third-party copyrighted material
              unless explicitly stated.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              6. FALSE CLAIMS
            </h2>

            <p className="mt-4 text-zinc-300">
              Submitting fraudulent copyright notices may result in legal
              liability under applicable laws.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              7. POLICY CHANGES
            </h2>

            <p className="mt-4 text-zinc-300">
              This policy may be updated without prior notice.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
