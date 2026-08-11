import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import "../styles/responsive.css";
import "../styles/motion.css";
import { Providers } from "./providers";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
import { profile } from "@/data/profile";
import { DeferredEnhancements } from "@/components/DeferredEnhancements";

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
    "Full-stack Engineer",
    "Product Engineer",
    "React Developer",
    "Next.js Developer",
    "Node.js Developer",
    "TypeScript",
    "Front-end Architecture",
    "Vilnius",
  ],
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    url: "/",
    siteName: profile.name,
    locale: "en_GB",
    type: "website",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${profile.name} — ${profile.role}` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.role}`,
    description: profile.tagline,
    images: ["/og.png"],
  },
  category: "technology",
  appleWebApp: {
    capable: true,
    title: profile.name,
    statusBarStyle: "default",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-light.svg?v=6", type: "image/svg+xml", media: "(prefers-color-scheme: light)" },
      { url: "/favicon-dark.svg?v=6", type: "image/svg+xml", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-192.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-192.png", type: "image/png", sizes: "192x192", media: "(prefers-color-scheme: dark)" },
      { url: "/icon-512.png", type: "image/png", sizes: "512x512", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-512.png", type: "image/png", sizes: "512x512", media: "(prefers-color-scheme: dark)" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    shortcut: ["/favicon.ico"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f7f5f2" },
    { media: "(prefers-color-scheme: dark)", color: "#1b212c" },
  ],
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  description: profile.tagline,
  url: "https://zajenckauskas.lt",
  image: "https://zajenckauskas.lt/avatar.png",
  email: `mailto:${profile.email}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Vilnius",
    addressCountry: "LT",
  },
  sameAs: [profile.github, profile.linkedin],
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
        <Providers>
          <div className="page-wash" aria-hidden="true" />
          <div data-page-shell className="flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <DeferredEnhancements />
        </Providers>
      </body>
    </html>
  );
}
