// app/terms-and-conditions/page.tsx

import Header from "@/components/Header";

export default function TermsAndConditionsPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold tracking-tight">
            Terms & Conditions
          </h1>

          <p className="mt-4 text-zinc-400">
            <strong>Effective Date:</strong> May 20, 2026
          </p>

          <p className="mt-6 leading-8 text-zinc-300">
            Welcome to DailyMovies.
          </p>

          <p className="mt-4 leading-8 text-zinc-300">
            By accessing or using DailyMovies, you agree to comply with these
            Terms & Conditions. If you do not agree, please discontinue use of
            the website.
          </p>

          {/* Section 1 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              1. USE OF WEBSITE
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies is provided for informational and entertainment
              purposes only.
            </p>

            <p className="mt-4 text-zinc-300">Users agree not to:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Abuse or attack the platform</li>
              <li>Attempt unauthorized access</li>
              <li>Distribute malicious software</li>
              <li>Copy or scrape website systems excessively</li>
              <li>Violate applicable laws</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">2. CONTENT</h2>

            <p className="mt-4 text-zinc-300">DailyMovies may display:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Movie metadata</li>
              <li>Posters</li>
              <li>Ratings</li>
              <li>Reviews</li>
              <li>Embedded media</li>
              <li>External links</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              All trademarks, logos, and copyrights belong to their respective
              owners.
            </p>
          </section>

          {/* Section 3 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              3. THIRD-PARTY LINKS
            </h2>

            <p className="mt-4 text-zinc-300">
              The website may contain external links or embedded services.
            </p>

            <p className="mt-4 text-zinc-300">
              DailyMovies does not control third-party content and is not
              responsible for:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Availability</li>
              <li>Accuracy</li>
              <li>Legality</li>
              <li>Downloads</li>
              <li>Advertisements</li>
              <li>External services</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              Users access third-party services at their own risk.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              4. INTELLECTUAL PROPERTY
            </h2>

            <p className="mt-4 text-zinc-300">
              The DailyMovies platform, including:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Website design</li>
              <li>Source code</li>
              <li>Branding</li>
              <li>UI/UX</li>
              <li>Databases</li>
              <li>Custom systems</li>
              <li>Graphics</li>
              <li>Original content</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              are protected intellectual property owned by DailyMovies unless
              otherwise stated.
            </p>

            <p className="mt-4 text-zinc-300">
              Unauthorized reproduction, resale, or redistribution is
              prohibited.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              5. DISCLAIMER OF WARRANTIES
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies is provided "AS IS" and "AS AVAILABLE" without
              warranties of any kind.
            </p>

            <p className="mt-4 text-zinc-300">We do not guarantee:</p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Continuous availability</li>
              <li>Accuracy</li>
              <li>Security</li>
              <li>Error-free operation</li>
              <li>Third-party reliability</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              6. LIMITATION OF LIABILITY
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies shall not be liable for:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Data loss</li>
              <li>Damages</li>
              <li>Legal issues</li>
              <li>Third-party actions</li>
              <li>External downloads</li>
              <li>Malware from third-party services</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              Users are responsible for their own actions and internet usage.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              7. TERMINATION
            </h2>

            <p className="mt-4 text-zinc-300">
              We reserve the right to restrict or terminate access to users
              violating these Terms.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              8. MODIFICATIONS
            </h2>

            <p className="mt-4 text-zinc-300">
              We may modify these Terms at any time without prior notice.
            </p>

            <p className="mt-4 text-zinc-300">
              Continued use of the website indicates acceptance of updated
              Terms.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              9. GOVERNING LAW
            </h2>

            <p className="mt-4 text-zinc-300">
              Applicable laws may vary depending on user jurisdiction and
              service region.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">10. CONTACT</h2>

            <p className="mt-4 text-zinc-300">
              For legal or support inquiries:
            </p>

            <div className="mt-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <p className="text-zinc-300">
                Email:{" "}
                <span className="font-medium text-white">
                  contact@dailymovies.example
                </span>
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
