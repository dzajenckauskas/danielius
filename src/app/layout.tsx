import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { profile } from "@/data/profile";
import { DoodleStudioGate } from "@/components/DoodleStudioGate";
import { PageTools } from "@/components/PageTools";
import { ScrollThread } from "@/components/ScrollThread";
import { ScrollProgress } from "@/components/ScrollProgress";
import { AnimatedFavicon } from "@/components/AnimatedFavicon";

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
    images: [{ url: "/avatar.png", width: 640, height: 640, alt: profile.name }],
  },
  twitter: {
    card: "summary",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: ["/avatar.png"],
  },
  category: "technology",
  icons: {
    icon: [
      { url: "/favicon-light.svg?v=6", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.svg?v=6", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
    ],
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
          <AnimatedFavicon />
          <ScrollProgress />
          <div className="page-wash" aria-hidden="true" />
          <div data-page-shell className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <ScrollThread />
          <PageTools />
          <DoodleStudioGate />
        </Providers>
      </body>
    </html>
  );
}
