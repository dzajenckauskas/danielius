import type { Metadata } from "next";
import localFont from "next/font/local";
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

// Self-hosted via next/font so the @font-face rules are inlined into the
// document head (no separate render-blocking CSS request for them) and the
// hero headline's weight (Black, the LCP element) is preloaded automatically.
// Italic isn't used anywhere in the UI (only the PDF resume renders italic
// text, and it reads the .otf files directly) so only roman weights are
// loaded here — next/font preloads everything in `src`, and there's no
// point shipping italic files nothing on the site ever displays.
const neris = localFont({
  src: [
    { path: "../../public/fonts/neris/Neris-Light.woff2", weight: "300", style: "normal" },
    { path: "../../public/fonts/neris/Neris-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../../public/fonts/neris/Neris-Black.woff2", weight: "900", style: "normal" },
  ],
  variable: "--font-neris",
  display: "swap",
});

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
      className={`${neris.variable} ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
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
