// app/contact-us/page.tsx

import Header from "@/components/Header";
import { Mail, ShieldCheck, MessageCircle } from "lucide-react";
import { Suspense } from "react";

export const metadata = {
  title: "Contact Us - DailyMovies",
  description:
    "Contact DailyMovies for support, copyright, or legal inquiries.",
};

export default function ContactUsPage() {
  return (
    <>
      <Suspense fallback={null}>
        <Header />
      </Suspense>

      <main className="min-h-screen bg-black px-6 py-12 text-white">
        <div className="mx-auto max-w-5xl">
          {/* Hero */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950 p-8 shadow-2xl">
            <h1 className="text-4xl font-bold tracking-tight">Contact Us</h1>

            <p className="mt-4 max-w-2xl leading-8 text-zinc-400">
              For support, copyright notices, business inquiries, or legal
              concerns related to DailyMovies, contact us using the information
              below.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {/* General Support */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
                <Mail className="text-red-500" size={22} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">General Support</h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                For general questions, feedback, or website-related issues.
              </p>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-4">
                <p className="text-sm text-zinc-400">Email</p>

                <p className="mt-1 font-medium text-white">
                  contact@dailymovies.example
                </p>
              </div>
            </div>

            {/* Copyright */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
                <ShieldCheck className="text-green-500" size={22} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">Copyright / DMCA</h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Submit copyright notices or intellectual property concerns.
              </p>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-4">
                <p className="text-sm text-zinc-400">Email</p>

                <p className="mt-1 font-medium text-white">
                  copyright@dailymovies.example
                </p>
              </div>
            </div>

            {/* Business */}
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 transition hover:border-zinc-700">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900">
                <MessageCircle className="text-blue-500" size={22} />
              </div>

              <h2 className="mt-5 text-xl font-semibold">Business Inquiries</h2>

              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Contact us regarding partnerships, advertising, or media-related
                communication.
              </p>

              <div className="mt-5 rounded-xl border border-zinc-800 bg-black p-4">
                <p className="text-sm text-zinc-400">Email</p>

                <p className="mt-1 font-medium text-white">
                  business@dailymovies.example
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Info */}
          <div className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
            <h2 className="text-2xl font-semibold">Response Time</h2>

            <p className="mt-4 leading-8 text-zinc-400">
              We aim to review and respond to all inquiries within a reasonable
              timeframe depending on request type and verification requirements.
            </p>

            <p className="mt-4 leading-8 text-zinc-400">
              Please include accurate details and relevant links when contacting
              us to help speed up the review process.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}
