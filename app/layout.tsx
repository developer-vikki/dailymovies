import type { Metadata } from "next";
import { Poppins, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/Theme-provider";
import Script from "next/script";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});
const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Daily Movies Hub - Your Ultimate Movie Shows",

  description:
    "Download Latest Movies, TV Shows, and Web Series in Full HD. Explore our vast collection of entertainment content and enjoy seamless streaming and downloading experience.",
  keywords: [
    "Daily Movies Hub",
    "Latest Movies",
    "TV Shows",
    "Web Series",
    "Full HD Movies",
    "Movie Downloads",
  ],

  authors: [{ name: "Movies Hub" }],

  creator: "Movies Hub",

  metadataBase: new URL("https://dailymovies.in"),

  openGraph: {
    title: "Daily Movies Hub",
    description:
      "Download Latest Movies, TV Shows, and Web Series in Full HD. Explore our vast collection of entertainment content and enjoy seamless streaming and downloading experience.",
    url: "https://dailymovies.in",
    siteName: "Daily Movies Hub",
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${poppins.variable} ${mono.variable} h-full antialiased`}
    >
      <head>
        {/* <Script
          src="https://cdn-in.pagesense.io/js/domisecinnovations/f4c3cdc2ab084ceea1a568c83e83da0d.js"
          strategy="afterInteractive"
        /> */}
      </head>
      <body className="flex flex-col min-h-screen bg-background text-foreground font-sans overflow-x-hidden">
        <ThemeProvider>{children} </ThemeProvider>
      </body>
    </html>
  );
}
