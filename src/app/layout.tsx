import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { profile } from "@/data/profile";
import { DoodleLayer } from "@/components/DoodleLayer";
import { ScrollThread } from "@/components/ScrollThread";
import { ScrollProgress } from "@/components/ScrollProgress";

export const metadata: Metadata = {
  metadataBase: new URL("https://zajenckauskas.lt"),
  applicationName: profile.name,
  title: {
    default: `${profile.name} — ${profile.role}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  authors: [{ name: profile.name, url: "https://zajenckauskas.lt" }],
  creator: profile.name,
  publisher: profile.name,
  keywords: [
    "Danielius Zajenčkauskas",
    "Front-end Engineer",
    "React Developer",
    "Next.js Developer",
    "TypeScript",
    "Front-end Architecture",
    "Vilnius",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: "/",
    siteName: profile.name,
    locale: "en_GB",
    type: "website",
    images: [{ url: "/avatar.jpg", width: 640, height: 640, alt: profile.name }],
  },
  twitter: {
    card: "summary",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: ["/avatar.jpg"],
  },
  category: "technology",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* The hero headline (LCP element) renders in Neris Black; preload it
            so the browser doesn't discover it late via CSS. */}
        <link
          rel="preload"
          href="/fonts/neris/Neris-Black.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen font-sans">
        <Providers>
          <ScrollProgress />
          <div className="page-wash" aria-hidden="true" />
          <div data-page-shell className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollThread />
          <DoodleLayer />
        </Providers>
      </body>
    </html>
  );
}
