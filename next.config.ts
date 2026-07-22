import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    // Prefer AVIF (smaller than WebP) for the optimizer so the hero portrait —
    // the LCP element on mobile — ships fewer bytes; fall back to WebP.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
