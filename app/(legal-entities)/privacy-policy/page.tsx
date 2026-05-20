// app/privacy-policy/page.tsx

import Header from "@/components/Header";

export default function PrivacyPolicyPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-black text-white px-6 py-12">
        <div className="mx-auto max-w-5xl rounded-2xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white">
            Privacy Policy
          </h1>

          <p className="mt-4 text-zinc-400">
            <strong>Effective Date:</strong> May 20, 2026
          </p>

          <p className="mt-6 leading-8 text-zinc-300">
            Welcome to DailyMovies.
          </p>

          <p className="mt-4 leading-8 text-zinc-300">
            This Privacy Policy explains how DailyMovies ("we", "our", or "us")
            collects, uses, stores, and protects user information when you
            access or use our website, services, applications, and related
            platforms.
          </p>

          <p className="mt-4 leading-8 text-zinc-300">
            By using DailyMovies, you agree to the practices described in this
            Privacy Policy.
          </p>

          {/* Section 1 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              1. INFORMATION WE COLLECT
            </h2>

            <p className="mt-4 text-zinc-300">
              We may collect the following types of information:
            </p>

            <div className="mt-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  A. Automatically Collected Information
                </h3>

                <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
                  <li>IP address</li>
                  <li>Browser type</li>
                  <li>Device information</li>
                  <li>Operating system</li>
                  <li>Pages visited</li>
                  <li>Referral source</li>
                  <li>Session duration</li>
                  <li>Cookies and analytics data</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  B. User-Provided Information
                </h3>

                <p className="mt-3 text-zinc-300">
                  If users voluntarily contact us or create accounts, we may
                  collect:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
                  <li>Name</li>
                  <li>Email address</li>
                  <li>Username</li>
                  <li>Messages or support requests</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white">
                  C. Third-Party Services Data
                </h3>

                <p className="mt-3 text-zinc-300">
                  We may use third-party services that collect information
                  independently, including:
                </p>

                <ul className="mt-3 list-disc space-y-2 pl-6 text-zinc-300">
                  <li>Analytics providers</li>
                  <li>Advertising networks</li>
                  <li>CDN and security providers</li>
                  <li>Video hosting services</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              2. HOW WE USE INFORMATION
            </h2>

            <p className="mt-4 text-zinc-300">
              We use collected information to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Improve website performance</li>
              <li>Enhance user experience</li>
              <li>Monitor traffic and security</li>
              <li>Prevent abuse and fraudulent activity</li>
              <li>Display personalized advertisements</li>
              <li>Respond to support requests</li>
              <li>Maintain website functionality</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">3. COOKIES</h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies may use cookies and similar technologies to:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Save user preferences</li>
              <li>Analyze traffic</li>
              <li>Improve performance</li>
              <li>Deliver advertisements</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              Users can disable cookies through their browser settings.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              4. THIRD-PARTY SERVICES
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies may integrate third-party services including:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Cloudflare</li>
              <li>Google Analytics</li>
              <li>Advertising partners</li>
              <li>Video players</li>
              <li>Embedded content providers</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              These third parties may collect data according to their own
              privacy policies.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              5. CONTENT AND EXTERNAL LINKS
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies may contain links, embeds, or references to
              third-party websites and external content.
            </p>

            <p className="mt-4 text-zinc-300">
              We do not control or take responsibility for:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Third-party websites</li>
              <li>External media</li>
              <li>Download sources</li>
              <li>Advertisements</li>
              <li>Embedded services</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              Users access third-party content at their own discretion and
              responsibility.
            </p>
          </section>

          {/* Section 6 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              6. COPYRIGHT AND CONTENT POLICY
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies respects copyright laws and intellectual property
              rights.
            </p>

            <p className="mt-4 text-zinc-300">
              If you are a copyright owner and believe any content infringes
              your rights, you may contact us with:
            </p>

            <ul className="mt-4 list-disc space-y-2 pl-6 text-zinc-300">
              <li>Proof of ownership</li>
              <li>URL of the reported content</li>
              <li>Contact information</li>
              <li>Legal identification of the copyrighted material</li>
            </ul>

            <p className="mt-4 text-zinc-300">
              Upon valid request, we may review and remove applicable content
              where appropriate.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              7. DATA SECURITY
            </h2>

            <p className="mt-4 text-zinc-300">
              We implement reasonable technical and organizational measures to
              help protect user information.
            </p>

            <p className="mt-4 text-zinc-300">
              However, no internet transmission or electronic storage system can
              be guaranteed to be 100% secure.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              8. CHILDREN&apos;S PRIVACY
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies is not intentionally directed toward children under
              the age required by local law.
            </p>

            <p className="mt-4 text-zinc-300">
              We do not knowingly collect personal information from minors
              without proper consent.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              9. ADVERTISING
            </h2>

            <p className="mt-4 text-zinc-300">
              Third-party advertising partners may use cookies, identifiers, or
              tracking technologies to display relevant ads.
            </p>

            <p className="mt-4 text-zinc-300">
              Users should review the privacy policies of those advertising
              providers separately.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              10. INTERNATIONAL USERS
            </h2>

            <p className="mt-4 text-zinc-300">
              By using DailyMovies, users understand that information may be
              processed and stored in different countries depending on hosting,
              CDN, analytics, and infrastructure providers.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              11. CHANGES TO THIS POLICY
            </h2>

            <p className="mt-4 text-zinc-300">
              We may update this Privacy Policy at any time without prior
              notice.
            </p>

            <p className="mt-4 text-zinc-300">
              Updated versions will be posted on this page with the revised
              effective date.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">12. CONTACT</h2>

            <p className="mt-4 text-zinc-300">
              For privacy-related concerns or copyright notices, contact:
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

          {/* Section 13 */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold text-white">
              13. DISCLAIMER
            </h2>

            <p className="mt-4 text-zinc-300">
              DailyMovies is an independent informational and media-related
              platform.
            </p>

            <p className="mt-4 text-zinc-300">
              All trademarks, logos, and copyrights belong to their respective
              owners.
            </p>

            <p className="mt-4 text-zinc-300">
              Users are responsible for ensuring compliance with local laws when
              accessing external content or third-party services.
            </p>
          </section>
        </div>
      </main>
    </>
  );
}
